import request from 'supertest';
import app from '../../../src/app';

import truncate from '../../util/truncate';
import factory from '../../factories';

describe('Checkin store', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to checkin student', async () => {
    const student = await factory.create('Student');
    const response = await request(app).post(
      `/students/${student.id}/checkins`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  xit('should not be able to checkin student not found', async () => {
    const response = await request(app).post('/students/1050/checkins');

    expect(response.status).toBe(400);
  });

  xit('should not be able to checkin student with more than 5 in 7 days', async () => {
    const student = await factory.create('Student');

    await factory.createMany('Checkin', 4, {
      student_id: student.id,
    });

    const response = await request(app).post(
      `/students/${student.id}/checkins`
    );

    expect(response.status).toBe(400);
  });
});
