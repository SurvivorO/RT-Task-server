import "dotenv/config"
import request from "supertest"
import app from "../src/app"


describe('Basic Server Health Checck', () => {
    it('should return 200 OK and Hello World on the root endpoint', async () => {
        const response = await request(app).get('/')

        expect(response.status).toBe(200)
        expect(response.text).toBe("Hello world!")

    })

    it('should return 200 OK and healthy status on the /health endpoint with valid API key', async () => {
        const response = await request(app)
            .get('/health')
            .set('x-api-key', process.env.INTERNAL_API_KEY)

        expect(response.status).toBe(200)
        expect(response.body).toEqual({status: "healthy"})

    })

    it('should return 404 Not Found on the /health endpoint without API key', async () => {
        const response = await request(app)
            .get('/health')

        expect(response.status).toBe(404)
        expect(response.text).toBe("Cannot GET /health")
    })
})