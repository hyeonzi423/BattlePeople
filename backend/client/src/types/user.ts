export interface BasicUserInfo {
	id: number;
	nickname: string;
	imgUrl: string;
}

export interface DetailUserInfo extends BasicUserInfo {
	email: string;
	accessExpiration?: string;
}
