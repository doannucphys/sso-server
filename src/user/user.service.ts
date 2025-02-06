import { Injectable } from '@nestjs/common';

// mock data
const FAKEUSER = {
  id: 1,
  name: 'fakeuser',
  username: 'fakeuser@mail.com',
};

@Injectable()
export class UserService {
  getProfile() {
    return FAKEUSER;
  }

  findByEmail(username: string) {
    console.log('function to get data of ', username);
    return FAKEUSER;
  }
}
