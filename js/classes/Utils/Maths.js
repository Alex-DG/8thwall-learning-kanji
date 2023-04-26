// https://www.opengl.org/sdk/docs/man/html/mix.xhtml

export const mix = (x, y, a) => {
  if (a <= 0) return x
  if (a >= 1) return y
  return x + a * (y - x)
}
