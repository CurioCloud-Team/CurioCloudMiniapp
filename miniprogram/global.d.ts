declare const wx: any

declare function getApp<T = IAppOption>(): T
declare function App<T = IAppOption>(option: T extends object ? T : IAppOption): void
declare function Component<T = WechatComponentOptions>(options: T): void
declare function Page<T = WechatPageOptions>(options: T): void

interface WechatComponentOptions {
	properties?: Record<string, any>
	data?: Record<string, any>
	methods?: Record<string, (...args: any[]) => any>
	options?: Record<string, any>
	lifetimes?: Record<string, () => void>
	observers?: Record<string, (...args: any[]) => void>
}

interface WechatPageOptions {
	data?: Record<string, any>
	onLoad?: (query?: Record<string, string>) => void
	onShow?: () => void
	onPullDownRefresh?: () => void
	onReachBottom?: () => void
	methods?: Record<string, (...args: any[]) => any>
	setData?: (data: Record<string, any>) => void
}
