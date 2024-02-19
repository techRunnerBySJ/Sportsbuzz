import { baseUrl } from './../../environments/environment';
export const getSquadDataEndPoint = `${baseUrl}/sportradar/squad`;

// APIs for news 
export const getTopStoriesEndPoint = `https://api.staging.sportsbuzz.com/webflow/topStories`;
export const getLatestNewsEndPoint = `https://api.staging.sportsbuzz.com/webflow/latestNews`;
export const getCricketNewsEndPoint = `https://api.staging.sportsbuzz.com/webflow/sportNews/cricket`;
export const getFootballNewsEndPoint = `https://api.staging.sportsbuzz.com/webflow/sportNews/football`;
export const getTennisNewsEndPoint = `https://api.staging.sportsbuzz.com/webflow/sportNews/tennis`;

// Login APIs
export const postRegisterEndPoint = `https://api.staging.sportsbuzz.com/user/register`;
export const postLoginEndPoint = `https://api.staging.sportsbuzz.com/user/login`;