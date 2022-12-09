/**
	文件描述：正则工具类
	创建人：卢信桥
	创建时间：2020-04-07
 */

/**
    校验手机号
    @param {String} phone 手机号
    @return {Boolean} 是否校验通过
*/
const validPhone = phone => {
	if (/^(1)[0-9]{10}$/.test(phone)) {
		return true
	}
	return false
}

/**
    校验验证码
    @param {String} code 验证码
    @return {Boolean} 是否校验通过
*/
const validCode = code => {
	if (/^\d{6}$/.test(code)) {
		return true
	}
	return false
}

/**
    校验邮箱
    @param {String} email 邮箱
    @return {Boolean} 是否校验通过
*/
const validEmail = email => {
	if (new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$").test(email)) {
		return true
	}
	return false
}

/**
    校验身份证号码
    @param {String} card 身份证号
    @return {Boolean} 是否校验通过
*/
const validCard = card => {
	if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(card)) {
		return true
	}
	return false
}

/**
    校验姓名
    @param {String} name 姓名
    @return {Boolean} 是否校验通过
*/
const validName = (name) => {
	if (name.indexOf('•') > -1 || name.indexOf('·') > -1) {
		return /^[\u4e00-\u9fa5]+[·•][\u4e00-\u9fa5]{1,18}$/.test(name)
	} else {
		return /^[\u4e00-\u9fa5]{2,20}$/.test(name) || /^[a-zA-Z0-9]{2,31}$/.test(name)
	}
}

module.exports = {
	validPhone: validPhone,
	validCode: validCode,
	validEmail: validEmail,
	validCard: validCard,
	validName: validName
}