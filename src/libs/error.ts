export class NOT_FOUND_ERROR extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class AUTHENTICATION_ERROR extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class BAD_REQUEST_ERROR extends Error {
  constructor(public message: string) {
    super(message);
  }
}
