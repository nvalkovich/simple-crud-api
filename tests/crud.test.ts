import supertest from 'supertest';
import users from '../src/storage/Storage';
import { AppServer } from '../src/app/AppServer';
import { ResponseMessages } from '../src/types/enums';
const app = new AppServer();
import { v4 as uuidv4 } from 'uuid';

const request = supertest(app.createServer());

const newUserData = {
  "username": "NewUserName",
  "age": "10",
  "hobbies": ["hobby1", "hobby2"]
};

describe('Scenarios', () => {
  beforeEach(() => {
    users.set([]);
  });

  it('Scenario 1: Get all users => Create new user => Get new user => Update user => Delete user => Try to get user (with valid/non-existent id)', async () => {
    //Get all records with a GET api/users request. An empty array is expected
    const initialGetResponse = await request.get('/api/users');

    expect(initialGetResponse.status).toBe(200);
    expect(initialGetResponse.text).toBe("[]");
          
    //A new object is created by a POST api/users request. A response containing newly created record is expected
    const postResponse = await request.post('/api/users').send(newUserData);
    expect(postResponse.status).toBe(201);
    const createdUser = JSON.parse(postResponse.text);
    expect(createdUser.username).toBe(newUserData.username); 

    //With a GET api/user/{userId} request, we try to get the created record by its id. The created record is expected
    const createdUserID = createdUser.id;
    const createdUserResponse = await request.get(`/api/users/${createdUserID}`);

    expect(createdUserResponse.status).toBe(200);
    expect(JSON.parse(createdUserResponse.text).username).toBe(newUserData.username);
    expect(JSON.parse(createdUserResponse.text).id).toBe(createdUserID);     

    //We try to update the created record with a PUT api/users/{userId}request. A response is expected containing an updated object with the same id
    const updateData = {
      username: 'TestNameUpdated',
    };

    const updatedUserResponse = await request.put(`/api/users/${createdUserID}`).send(updateData);
    
    expect(updatedUserResponse.status).toBe(200);
    expect(JSON.parse(updatedUserResponse.text).username).toBe(updateData.username);
    expect(JSON.parse(updatedUserResponse.text).id).toBe(createdUserID)

    //With a DELETE api/users/{userId} request, we delete the created object by id. Confirmation of successful deletion is expected
    const deletedUserResponse = await request.delete(`/api/users/${createdUserID}`);
    expect(deletedUserResponse.status).toBe(204);

    //With a GET api/users/{userId} request, we are trying to get a deleted object by id. Expected answer is that there is no such object
    const getDeleteUserResponse = await request.get(`/api/users/${createdUserID}`);

    expect(getDeleteUserResponse.status).toBe(404);
    expect(JSON.parse(getDeleteUserResponse.text).message).toBe(ResponseMessages.UserNotFound);
  });

  it('Scenario 2: Create new user => Try to get all users (with invalid route) => Get all users => Try to get user (with invalid/non-existent id) => Try to get user (with valid/non-existent id) => Get user =>  Try to delete user (with invalid/non-existent id) => Try to delete user (with valid/non-existent id) => Delete user => Get all users', async () => {
    //A new object is created by a POST api/users request. A response containing newly created user is expected.
    const postResponse = await request.post('/api/users').send(newUserData);
    expect(postResponse.status).toBe(201);
    const createdUser = JSON.parse(postResponse.text);
    expect(createdUser.username).toBe(newUserData.username);

    const createdUserID = createdUser.id;
    
    //With a GET api/user/ request, try to get all users. A response containing newly created user is expected.
    const invalidRouteResponse = await request.get('/api/users/');
    expect(invalidRouteResponse.status).toBe(404);
    expect(JSON.parse(invalidRouteResponse.text).message).toBe(ResponseMessages.InvalidRoute);

    //With a GET api/user request, get all users. An "Invalid Route" error is expected. Expected created user.
    const allUsersResponse = await request.get('/api/users');

    expect(allUsersResponse.status).toBe(200);
    expect(JSON.parse(allUsersResponse.text)).toHaveLength(1);
    expect(JSON.parse(allUsersResponse.text)[0].username).toBe(newUserData.username);

    //With a GET api/user/{invalidId} (dont matches uuid format) request, we try to get the created record by its id. An "Invalid Id" error is expected.
    const getByInvalidIDResponse = await request.get(`/api/users/${createdUserID.slice(2)}`);

    expect(getByInvalidIDResponse.status).toBe(400);
    expect(JSON.parse(getByInvalidIDResponse.text).message).toBe(ResponseMessages.InvalidId)  

    //With a GET api/user/{notFoundID} (matches uuid format) request, we try to get the created record by its id. An "User not found" error is expected.
    const getByNotFoundIDResponse = await request.get(`/api/users/${uuidv4()}`);

    expect(getByNotFoundIDResponse.status).toBe(404);
    expect(JSON.parse(getByNotFoundIDResponse.text).message).toBe(ResponseMessages.UserNotFound)  

    //With a GET api/user/{existingUserID} request, we try to get user by its id (the created record is expected)
    const createdUserResponse = await request.get(`/api/users/${createdUserID}`);

    expect(createdUserResponse.status).toBe(200);
    expect(JSON.parse(createdUserResponse.text).username).toBe(newUserData.username);
    expect(JSON.parse(createdUserResponse.text).id).toBe(createdUserID);     

    //With a DELETE api/users/{invalidId} (dont matches uuid format) request, we try delete user by id. An "Invalid ID" error is expected.
    const deleteByInvalidIDResponse = await request.get(`/api/users/${createdUserID.slice(2)}`);

    expect(deleteByInvalidIDResponse.status).toBe(400);
    expect(JSON.parse(deleteByInvalidIDResponse.text).message).toBe(ResponseMessages.InvalidId)  
  
    //With a DELETE api/users/{notFoundID} (matches uuid format) request, we try delete user by id. An "User not found" error is expected.
    const deleteByNotFoundIDResponse = await request.get(`/api/users/${uuidv4()}`);

    expect(deleteByNotFoundIDResponse.status).toBe(404);
    expect(JSON.parse(deleteByNotFoundIDResponse.text).message).toBe(ResponseMessages.UserNotFound)  
  
   //With a DELETE api/users/{existingUserID} request, we delete user by id. Confirmation of successful deletion is expected.
    const deletedUserResponse = await request.delete(`/api/users/${createdUserID}`);
    expect(deletedUserResponse.status).toBe(204);

   //Get all users with a GET api/users request. An empty array is expected.
    const getUsersAfterDeleteResponse = await request.get('/api/users');
    expect(getUsersAfterDeleteResponse.status).toBe(200);
    expect(getUsersAfterDeleteResponse.text).toBe("[]");
  });

  it('Scenario 3: Try to create new user (invalid data) => Create new user => Try to update user (with invalid/non-existent id) => Try to update user (with valid/non-existent id) => Update user => Get updated user => Create other user => Get all users', async () => {
    const invalidUserData = {
      "username": "Without require"
    }

    const otherNewUserData = {
      username: 'OtherNewUserName',
      age: '20',
      hobbies: ['other-hobby1', 'other-hobby2'],
    }
    
    //Try to create new user by a POST api/users request (data without required fields). Error 'Required fields' expected.
    const invalidPostResponse = await request.post('/api/users').send(invalidUserData);
    expect(invalidPostResponse.status).toBe(400);
    expect(JSON.parse(invalidPostResponse.text).message).toBe(ResponseMessages.BodyNotContainRequiredFields);
  
    //Create new user by a POST api/users request (valid data). A response containing newly created user is expected.
    const ppstNewUserResponse = await request.post('/api/users').send(newUserData);
    expect(ppstNewUserResponse.status).toBe(201);
    const createdNewUser = JSON.parse(ppstNewUserResponse.text);
    expect(createdNewUser.username).toBe(newUserData.username);

    const createdUserID = createdNewUser.id;

    //Try to update user with a PUT api/users/{invalidUserID} request. An "Invalid ID" error is expected.
    const updateData = {
      "username": "TestNameUpdated"
    }

    const updateByInvalidIDResponse = await request.put(`/api/users/${createdUserID.slice(2)}`).send(updateData);
    
    expect(updateByInvalidIDResponse.status).toBe(400);
    expect(JSON.parse(updateByInvalidIDResponse.text).message).toBe(ResponseMessages.InvalidId);

    //Try to update user with a PUT api/users/{notFoundID} request. An "User not found" error is expected.
    const updateByNotFoundIDResponse = await request.put(`/api/users/${uuidv4()}`).send(updateData);
    
    expect(updateByNotFoundIDResponse.status).toBe(404);
    expect(JSON.parse(updateByNotFoundIDResponse.text).message).toBe(ResponseMessages.UserNotFound);
  
    //Update user with a PUT api/users/{userID} request. An "User not found" error is expected.
    const updatedUserResponse = await request.put(`/api/users/${createdUserID}`).send(updateData);

    expect(updatedUserResponse.status).toBe(200);
    expect(JSON.parse(updatedUserResponse.text).username).toBe(updateData.username);
    expect(JSON.parse(updatedUserResponse.text).id).toBe(createdUserID);

    //With a GET api/user/{userID} request, get updated user by its id. The updated user is expected.
    const createdUserResponse = await request.get(`/api/users/${createdUserID}`);

    expect(createdUserResponse.status).toBe(200);
    expect(JSON.parse(createdUserResponse.text).username).toBe(updateData.username);    

    //Create other new user by a POST api/users request (valid data). A response containing newly created user is expected.
    const postOtherUserResponse = await request.post('/api/users').send(otherNewUserData);
    expect(postOtherUserResponse.status).toBe(201);
    const createdUser = JSON.parse(postOtherUserResponse.text);
    expect(createdUser.username).toBe(otherNewUserData.username);

    //Get users with a GET api/users request.Two users in array are expected;
    const getUpdatedUserResponse = await request.get(`/api/users`);

    expect(getUpdatedUserResponse.status).toBe(200);
    expect(JSON.parse(getUpdatedUserResponse.text)).toHaveLength(2);
  });
  
});