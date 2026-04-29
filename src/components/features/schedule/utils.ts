export const formatTime = (time: string) => time.substring(0, 5);

export const isTimeOverlap = (s1: string, e1: string, s2: string, e2: string): boolean =>
  (s1 >= s2 && s1 < e2) || (e1 > s2 && e1 <= e2) || (s1 <= s2 && e1 >= e2);