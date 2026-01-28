const axios = require('axios');

async function testInstructorFlow() {
    try {
        console.log('1. Attempting login...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'john@edumaster.com',
            password: 'password123'
        });

        console.log('Login successful!');
        const token = loginResponse.data.token;
        console.log('Token received');

        console.log('\n2. Fetching instructor courses...');
        const coursesResponse = await axios.get('http://localhost:5000/api/instructor/my-courses', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`Fetched ${coursesResponse.data.length} courses:`);
        coursesResponse.data.forEach(c => {
            console.log(`- ${c.title} (Published: ${c.published})`);
        });

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testInstructorFlow();
