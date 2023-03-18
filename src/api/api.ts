// import { Course } from "../types/course";

const BASE_URL = 'http://api.wisey.app/api/v1';

function getToken() {
  return fetch(BASE_URL + '/auth/anonymous?platform=subscriptions')
  .then(response => {
    if (!response.ok) {
      throw new Error();
    }

    return response.json();
  })
  .then(res => res.token);
};

async function get(url: string) {
  const options: RequestInit = { method: 'GET' };

  options.headers = {
    'Authorization': `Bearer ${await getToken()}`,
    'Access-Control-Allow-Origin': '*',
    'Vary': 'Origin',
  };
  // options.mode = 'no-cors';

  return fetch(BASE_URL + url, options)
    .then(response => {
      if (!response.ok) {
        console.log(response);
      }

      return response.json();
    })
}


export const getCourses = () => get('/core/preview-courses').then(res => res.courses);

export const getCourse = (courseId: string) => get(`/core/preview-courses/${courseId}`);
