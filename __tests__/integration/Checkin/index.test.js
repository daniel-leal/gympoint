import request from 'supertest';

import app from '../../../src/app';
import factory from '../../factories';
import truncate from '../../util/truncate';

describe('Checkin index', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able show all student checkins', async () => {
    const student = await factory.create('Student');
    const checkin = await factory.create('Checkin', {
      student_id: student.id,
    });

    const response = await request(app).get(`/students/${student.id}/checkins`);

    expect(response.status).toBe(200);
    expect(response.body[0].id).toBe(checkin.id);
  });
});
