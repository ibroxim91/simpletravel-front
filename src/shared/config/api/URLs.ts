const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://simple-travel.felixits.uz';

const ENDP_POSTS = '/posts/';
const GET_TICKETS = '/api/v1/tickets/';
const GET_BLOGS = '/api/v1/post/';
const GET_TAGS = '/api/v1/category/';

export { BASE_URL, ENDP_POSTS, GET_BLOGS, GET_TAGS, GET_TICKETS };
