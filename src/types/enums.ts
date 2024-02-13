export enum ResponseMessages {
  InvalidId = 'Invalid id',
  UserNotFound = 'User not found',
  InvalidBody = 'Requst body is not valid',
  InvalidBodyFields = 'There are invalid fields in requst body. Valid fields: username, age, hobbies',
  InvalidBodyTypes = 'There are invalid types in requst body. Valid types: username - string, age - number, hobbies - array',
  ServerError = 'Internal server error',
  BodyNotContainRequiredFields = 'Body does not contain required fields. Required fields: username, age, hobbies',
  InvalidRoute = 'Invalid route. Please check the entered URL or request method.'
}