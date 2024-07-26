import dotenv from 'dotenv';
import axios from 'axios';
import * as fs from 'node:fs/promises';
import path from 'path';
import qs from 'qs';
import tough from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

dotenv.config();

const cookieJar = new tough.CookieJar();
const client = wrapper(axios.create({ jar: cookieJar }));

const loginUrl = process.env.LOGIN_URL as string;
const dataUrl = process.env.DATA_URL as string;

const loginData = {
  csrfmiddlewaretoken: process.env.CSRF_TOKEN,
  next: 'https://stibmivb.opendatasoft.com/pages/home/',
  username: process.env.USERNAME,
  password: process.env.PASSWORD
};

const fetchData = async (): Promise<void> => {
  try {
    // Login to get new CSRF token and session cookie
    const loginResponse = await client.post(loginUrl, qs.stringify(loginData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `csrftoken=${process.env.CSRF_TOKEN}`,
        'Referer': loginUrl
      }
    });

    // Extract CSRF token and session cookie from the login response
    const setCookieHeader = loginResponse.headers['set-cookie'];
    let csrftoken: string | undefined;
    let sessionid: string | undefined;

    if (setCookieHeader) {
      setCookieHeader.forEach(cookie => {
        if (cookie.includes('csrftoken')) {
          csrftoken = cookie.split(';')[0].split('=')[1];
        } else if (cookie.includes('sessionid')) {
          sessionid = cookie.split(';')[0].split('=')[1];
        }
      });
    }

    if (!csrftoken || !sessionid) {
      throw new Error('CSRF token or session ID not found in login response');
    }

    // Fetch data with the new CSRF token and session cookie
    const response = await axios.get(dataUrl, {
      headers: {
        'X-CSRFToken': csrftoken,
        'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid}`,
      }
    });

    const data = response.data;
    const jsonPath = path.join(process.cwd(), 'public/data/vehicle-position-rt-production.json');
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
    console.log('Data updated:', new Date());
  } catch (error) {
    console.error('Error fetching data:', (error as Error).message);
    console.error('Error details:', error);
  }
};

// Fetch data every 12 seconds
setInterval(fetchData, 12000);
fetchData();
