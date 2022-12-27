/* eslint-disable @typescript-eslint/no-explicit-any */
import { provide, inject } from 'vue'
import axios from '@/api'
import type { AxiosInstance } from 'axios'

import auth, { RAuth } from './auth'
import users, { RUsers } from './users'
import common, { RCommon } from './common'
import messages, { RMessages } from './messages'

interface Service {
	auth: RAuth
	users: RUsers
	common: RCommon
	messages: RMessages
}

export default function repositories(axios: AxiosInstance) {
	return {
		get auth() {
			return lazyBind<RAuth>(() => import('./auth'), auth(axios), axios)
		},
		get users() {
			return lazyBind<RUsers>(() => import('./users'), users(axios), axios)
		},
		get common() {
			return lazyBind<RCommon>(() => import('./common'), common(axios), axios)
		},
		get messages() {
			return lazyBind<RMessages>(() => import('./messages'), messages(axios), axios)
		},
	}
}

export const RepositoryIdentifier = Symbol('api repositories')

export function useRepositoryProvider() {
	provide(RepositoryIdentifier, repositories(axios))
}

export function useRepositoryContext() {
	return inject(RepositoryIdentifier) as Service
}

function lazyBind<T>(repoFactory: any, repoInterface: T, axios: AxiosInstance) {
	return {
		...Object.keys(repoInterface).reduce((acc, method: any) => {
			const resolvedMethod = async (...args: any[]) => {
				const repo: any = await repoFactory()
				return repo.default(axios)[method](...args)
			}
			return {
				...acc,
				[method]: resolvedMethod,
			}
		}, {}),
	}
}
