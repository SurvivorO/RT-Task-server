import request from "supertest"
import app from "../src/app"


describe('Basic Server Health Checck', () => {
    it('should return 200 OK and Hello World on the root endpoint', async () => {
        const response = await request(app).get('/')

        expect(response.status).toBe(200)
        expect(response.text).toBe("Hello world!")

    })
})