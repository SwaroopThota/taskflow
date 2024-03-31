import { HTTP_STATUS_CODES, UserType } from '../lib/util/types'
import axios from 'axios'
import querystring from 'querystring'
import { IDType } from '../lib/util/types'
import JWTHandler from './JWTHandler'
import CustomError from '../lib/util/error handling/CustomError'
import UserFacade from '../lib/Facade/UserFacade'
require('express-async-errors')

export function getGithubLoginURL() {
	let client_id = process.env.GITHUB_CLIENT_ID || ''
	let redirect_uri = process.env.GITHUB_REDIRECT_URL || ''
	const params = new URLSearchParams({
		client_id,
		redirect_uri,
		scope: ['read:user', 'user:email'].join(' '),
		allow_signup: 'true',
	})

	return `https://github.com/login/oauth/authorize?${params.toString()}`
}

export async function handleGitHubUserLogin(code: string) {
	const userFacade = new UserFacade()
	const access_token = await getAccessTokenFromGithub(code)
	const {
		data: { email, name, avatar_url },
	} = await getUserDetailsFromGitHub(access_token)

	let userId: IDType

	const existingUserIO = await userFacade.retriveByEmail(email)

	if (existingUserIO) {
		userId = existingUserIO.data
	} else {
		let newUser: UserType = {
			email,
			name,
			userProfileUrl: avatar_url,
			githubAccessToken: access_token,
		}
		const newUserIO = await userFacade.insert(newUser)
		userId = newUserIO.data
	}

	let jwtHandler = new JWTHandler()
	const userIO = await userFacade.retrieveByID(userId)
	const user = userIO.data
	if (!user.githubAccessToken) {
		user.githubAccessToken = access_token
		userFacade.update(user)
	}
	let token = jwtHandler.getJwtTokenForUser(user)
	return token
}

async function getUserDetailsFromGitHub(access_token: string) {
	return await axios({
		url: 'https://api.github.com/user',
		method: 'get',
		headers: {
			Authorization: `token ${access_token}`,
		},
	})
}

async function getAccessTokenFromGithub(code: string) {
	const client_id = process.env.GITHUB_CLIENT_ID || '',
		client_secret = process.env.GITHUB_CLIENT_SECRET || '',
		redirect_uri = process.env.GITHUB_REDIRECT_URL || ''
	const { data } = await axios({
		url: 'https://github.com/login/oauth/access_token',
		method: 'get',
		params: {
			redirect_uri,
			client_id,
			client_secret,
			code,
		},
	})
	const parsedData = querystring.parse(data)
	if (parsedData.error)
		throw new CustomError(
			parsedData.error_description as string,
			HTTP_STATUS_CODES.BAD_REQUEST,
			'Github Login code error'
		)
	return (parsedData?.access_token as string) || ''
}
