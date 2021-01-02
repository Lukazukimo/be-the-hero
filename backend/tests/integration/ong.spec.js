const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')
const faker = require('faker')

describe('ONG', () => {
    // beforeAll(async () => {
    //     await connection.initialize()
    //     await connection.migrate.forceFreeMigrationsLock()
    // })

    beforeEach(async () => {
        await connection.migrate.rollback()
        await connection.migrate.latest()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it('should be able to create a new ONG', async () => {
        const ong = {
            name: faker.company.companyName(),
            email: faker.internet.email(),
            // whatsapp: faker.phone.phoneNumber(),
            whatsapp: "11900000000",
            city: faker.address.city(),
            uf: faker.address.stateAbbr()
        }

        const response = await request(app)
            .post('/ongs')
            .send(ong)
                
        expect(response.body).toHaveProperty('id')
        expect(response.body.id).toHaveLength(8)
    })

    it('should be able to list ONGs', async () => {
        const response = await request(app)
            .get('/ongs')
                
        expect(response.body).toEqual(expect.any(Array))
    })

    it('should be able to found ONG`s ID', async () => {
        const ong = {
            name: faker.company.companyName(),
            email: faker.internet.email(),
            // whatsapp: faker.phone.phoneNumber(),
            whatsapp: "11900000000",
            city: faker.address.city(),
            uf: faker.address.stateAbbr()
        }

        let response = await request(app)
            .post('/ongs')
            .send(ong)

        const id = response.body.id

        response = await request(app)
            .post('/sessions')
            .send({ id: id })     

        expect(response.body.name).toEqual(expect.any(String))
    })

    it('should not be able to found ONG`s ID', async () => {
        const ong = {
            name: faker.company.companyName(),
            email: faker.internet.email(),
            // whatsapp: faker.phone.phoneNumber(),
            whatsapp: "11900000000",
            city: faker.address.city(),
            uf: faker.address.stateAbbr()
        }

        let response = await request(app)
            .post('/ongs')
            .send(ong)

        response = await request(app)
            .post('/sessions')
            .send({ id: 'anyID' })     

        expect(response.status).toBe(400)
    })
})