import { Request, Response, NextFunction } from 'express'

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const start = Date.now()
  const { method, url, ip } = req

_res.on('finish', () => {
    const duration = Date.now() - start
    const { statusCode } = _res
    const color = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m'

    console.log(
      `${color}${method}\x1b[0m ${url} ${color}${statusCode}\x1b[0m - ${duration}ms - ${ip}`
    )
  })

  next()
}

