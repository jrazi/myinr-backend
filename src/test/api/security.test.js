
const request = require('supertest')
const app = require('../../app/app');
const jwt = require('jsonwebtoken');

const wrongToken = "Bearer " + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUtYXBpIiwiYXVkIjoic2VjdXJlLWFwcCIsInN1YiI6ImFkbWluIiwiZXhwIjoxNjE0Nzg5NDA1LCJyb2wiOiJTVVBFUl9BRE1JTiJ9.W6cpM9qR5bz4sh2n54tG8BPCMXUk_WhTErojQonOtAjXv9YxJ0X-kmgX9LugNA16vSXo1DelIJdHDIY6xtTlEQ';
const tokenSecret = process.env.TOKEN_SECRET;
const doctorToken = "Bearer " + jwt.sign(
    {
        userId: 4129,
        role: 1
    },
    tokenSecret,
    {
        expiresIn: 3600,
    }
);
const patientToken = "Bearer " + jwt.sign(
    {
        userId: 9146,
        role: 3,
    },
    tokenSecret,
    {
        expiresIn: 3600,
    }
);


describe('authorization filter test', () => {
    it('should send 401 when accessing /doctor with no token', async () => {
        const res = await request(app)
            .get('/api/v1/doctor/me')
            .send();

        expect(res.statusCode).toEqual(401);
        expect(res.body.status).toEqual(401);
        expect(res.body).toHaveProperty('code');
    })
    it('should send 401 when accessing /doctor with wrong token', async () => {
        const res = await request(app)
            .get('/api/v1/doctor/patient')
            .set('Authorization', wrongToken)
            .send();

        expect(res.statusCode).toEqual(401)
    })
    it('should send 401 when accessing /patient with wrong token', async () => {
        const res = await request(app)
            .get('/api/v1/doctor/patient')
            .set('Authorization', wrongToken)
            .send();

        expect(res.statusCode).toEqual(401)
    })
    it('should send 200 when accessing /doctor with right token', async () => {
        const res = await request(app)
            .get('/api/v1/doctor/me')
            .set('Authorization', doctorToken)
            .send();

        expect(res.statusCode).toEqual(200)
    })
    it('should send 200 when accessing /patient with right token', async () => {
        const res = await request(app)
            .get('/api/v1/patient/me')
            .set('Authorization', patientToken)
            .send();

        expect(res.statusCode).toEqual(200)
    })
    it('should send 403 when accessing /doctor with patient token', async () => {
        const res = await request(app)
            .get('/api/v1/doctor/patient')
            .set('Authorization', patientToken)
            .send();

        expect(res.statusCode).toEqual(403)
        expect(res.body.status).toEqual(403);
    })
    it('should send 403 when accessing /patient with doctor token', async () => {
        const res = await request(app)
            .get('/api/v1/patient/me')
            .set('Authorization', doctorToken)
            .send();

        expect(res.statusCode).toEqual(403)
    })
})
