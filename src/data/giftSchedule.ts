const casinoTimeZone = 'America/Los_Angeles';

export interface GiftPeriod {
  index: number;
  key: string;
  pickupDate: string;
  claimDates: string;
  giftIndex: number;
  opensAt: number;
  closesAt: number;
}

function casinoDateParts(now: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: casinoTimeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now);

  const number = (type: string): number => Number(
    parts.find((part) => part.type === type)?.value,
  );

  return {
    year: number('year'),
    month: number('month'),
    day: number('day'),
    hour: number('hour'),
    minute: number('minute'),
    second: number('second'),
  };
}

function calendarSecond(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
  second = 0,
): number {
  return Date.UTC(year, month - 1, day, hour, minute, second) / 1000;
}

const monthlyGiftOrder = new Map<string, number[]>();

function shuffledGiftIndices(year: number, month: number): number[] {
  const key = `${year}-${String(month).padStart(2, '0')}`;
  const existingOrder = monthlyGiftOrder.get(key);

  if (existingOrder) {
    return existingOrder;
  }

  const indices = [0, 1, 2, 3, 4];

  for (let index = indices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));

    [indices[index], indices[swapIndex]] = [
      indices[swapIndex],
      indices[index],
    ];
  }

  monthlyGiftOrder.set(key, indices);

  return indices;
}

function giftPeriodsForMonth(year: number, month: number): GiftPeriod[] {
  const firstDayOfWeek = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const firstThursday = 1 + (4 - firstDayOfWeek + 7) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const thursdayCount = Math.floor((daysInMonth - firstThursday) / 7) + 1;
  const giftIndices = shuffledGiftIndices(year, month);

  const shortDate = (day: number): string => new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day))).toUpperCase();

  return Array.from({ length: thursdayCount }, (_, index) => {
    const thursday = firstThursday + index * 7;
    const monday = thursday - 3;
    const sameMonth = monday >= 1;
    const mondayDate = shortDate(monday);
    const thursdayDate = shortDate(thursday);
    const pickupDate = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(new Date(Date.UTC(year, month - 1, thursday)));

    return {
      index,
      key: `${year}-${String(month).padStart(2, '0')}-${index}`,
      giftIndex: giftIndices[index],
      pickupDate,
      claimDates: sameMonth
        ? `${mondayDate}–${thursday}`
        : `${mondayDate} – ${thursdayDate}`,
      opensAt: calendarSecond(year, month, monday, 7),
      closesAt: calendarSecond(year, month, thursday, 19, 0, 59),
    };
  });
}

export function giftSchedule(now = new Date()): {
  periods: GiftPeriod[];
  currentSecond: number;
} {
  const { year, month, day, hour, minute, second } = casinoDateParts(now);
  const currentSecond = calendarSecond(year, month, day, hour, minute, second);

  const previousMonth = new Date(Date.UTC(year, month - 2, 1));
  const nextMonth = new Date(Date.UTC(year, month, 1));

  const periods = [
    ...giftPeriodsForMonth(
      previousMonth.getUTCFullYear(),
      previousMonth.getUTCMonth() + 1,
    ),
    ...giftPeriodsForMonth(year, month),
    ...giftPeriodsForMonth(
      nextMonth.getUTCFullYear(),
      nextMonth.getUTCMonth() + 1,
    ),
  ];

  return { periods, currentSecond };
}

export function activeGiftPeriod(now = new Date()): GiftPeriod | null {
  const { periods, currentSecond } = giftSchedule(now);

  return periods.find((period) => (
    currentSecond >= period.opensAt && currentSecond <= period.closesAt
  )) ?? null;
}

export function monthlyGiftPeriods(now = new Date()): {
  periods: GiftPeriod[];
  currentSecond: number;
} {
  const { year, month } = casinoDateParts(now);
  const { currentSecond } = giftSchedule(now);

  const nextMonth = new Date(Date.UTC(year, month, 1));
  const upcomingPeriods = giftPeriodsForMonth(
    nextMonth.getUTCFullYear(),
    nextMonth.getUTCMonth() + 1,
  );
  const upcomingGiftIsOpen = upcomingPeriods.some((period) => (
    currentSecond >= period.opensAt && currentSecond <= period.closesAt
  ));

  return {
    periods: upcomingGiftIsOpen
      ? upcomingPeriods
      : giftPeriodsForMonth(year, month),
    currentSecond,
  };
}

/** Milliseconds until the next claim opening or the first expired second. */
export function millisecondsUntilGiftBoundary(now = new Date()): number | null {
  const { periods, currentSecond } = giftSchedule(now);
  const nextBoundary = periods
    .flatMap((period) => [period.opensAt, period.closesAt + 1])
    .filter((boundary) => boundary > currentSecond)
    .sort((first, second) => first - second)[0];

  if (nextBoundary === undefined) {
    return null;
  }

  return (nextBoundary - currentSecond) * 1000 - now.getMilliseconds();
}
