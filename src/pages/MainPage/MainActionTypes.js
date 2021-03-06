// actionTypes
// --- 全局
export const LOGIN = 'LOGIN'
export const LOGIN_OA1 = 'LOGIN_OA1'
export const LOGIN_OA2 = 'LOGIN_OA2'
export const IS_SUSPENSION = 'IS_SUSPENSION',
             IS_SUSPENSION_PENDING = 'IS_SUSPENSION_PENDING',
             IS_SUSPENSION_FULFILLED = 'IS_SUSPENSION_FULFILLED',
             IS_SUSPENSION_REJECTED = 'IS_SUSPENSION_REJECTED'
export const SET_CURRACC = 'SET_CURRACC'
export const INIT_SOCKET = 'INIT_SOCKET',
             CLEAR_SOCKET = 'CLEAR_SOCKET'
export const OPEN_ORDER = 'OPEN_ORDER',
             OPEN_ORDER_PENDING = 'OPEN_ORDER_PENDING',
             OPEN_ORDER_FULFILLED = 'OPEN_ORDER_FULFILLED',
             OPEN_ORDER_REJECTED = 'OPEN_ORDER_REJECTED'
export const SET_THEME = 'SET_THEME'

// --- 报价板块
export const GET_SYMBOLS = 'GET_SYMBOLS',
             GET_SYMBOLS_PENDING = 'GET_SYMBOLS_PENDING',
             GET_SYMBOLS_FULFILLED = 'GET_SYMBOLS_FULFILLED',
             GET_SYMBOLS_REJECTED = 'GET_SYMBOLS_REJECTED'
export const SET_SYMBOLS = 'SET_SYMBOLS'
export const SET_SYMBOL_GROUP = 'SET_SYMBOL_GROUP'
export const GET_SYMBOLINFO = 'GET_SYMBOLINFO',
             GET_SYMBOLINFO_PENDING = 'GET_SYMBOLINFO_PENDING',
             GET_SYMBOLINFO_FULFILLED = 'GET_SYMBOLINFO_FULFILLED',
             GET_SYMBOLINFO_REJECTED = 'GET_SYMBOLINFO_REJECTED'


// --- K线
export const ADD_TO_KLINE = 'ADD_TO_KLINE'
export const DELETE_FROM_KLINE = 'DELETE_FROM_KLINE'

// --- 新闻
export const GET_NEWSDATA = 'GET_NEWSDATA',
             GET_NEWSDATA_PENDING = 'GET_NEWSDATA_PENDING',
             GET_NEWSDATA_FULFILLED = 'GET_NEWSDATA_FULFILLED',
             GET_NEWSDATA_REJECTED = 'GET_NEWSDATA_REJECTED'
// --- 财经日历
export const GET_CALENDARDATA = 'GET_CALENDARDATA',
             GET_CALENDARDATA_PENDING = 'GET_CALENDARDATA_PENDING',
             GET_CALENDARDATA_FULFILLED = 'GET_CALENDARDATA_FULFILLED',
             GET_CALENDARDATA_REJECTED = 'GET_CALENDARDATA_REJECTED'
export const GET_ECODETAIL = 'GET_ECODETAIL',
             GET_ECODETAIL_PENDING = 'GET_ECODETAIL_PENDING',
             GET_ECODETAIL_FULFILLED = 'GET_ECODETAIL_FULFILLED',
             GET_ECODETAIL_REJECTED = 'GET_ECODETAIL_REJECTED'

// --- 订单
export const GET_POSITIONS = 'GET_POSITIONS',
             GET_POSITIONS_PENDING = 'GET_POSITIONS_PENDING',
             GET_POSITIONS_FULFILLED = 'GET_POSITIONS_FULFILLED',
             GET_POSITIONS_REJECTED = 'GET_POSITIONS_REJECTED'
export const GET_HISTORIES = 'GET_HISTORIES',
             GET_HISTORIES_PENDING = 'GET_HISTORIES_PENDING',
             GET_HISTORIES_FULFILLED = 'GET_HISTORIES_FULFILLED',
             GET_HISTORIES_REJECTED = 'GET_HISTORIES_REJECTED'
export const MODIFY_ORDER = 'MODIFY_ORDER',
             MODIFY_ORDER_PENDING = 'MODIFY_ORDER_PENDING',
             MODIFY_ORDER_FULFILLED = 'MODIFY_ORDER_FULFILLED',
             MODIFY_ORDER_REJECTED = 'MODIFY_ORDER_REJECTED'
export const CLOSE_ORDER = 'CLOSE_ORDER',
             CLOSE_ORDER_PENDING = 'CLOSE_ORDER_PENDING',
             CLOSE_ORDER_FULFILLED = 'CLOSE_ORDER_FULFILLED',
             CLOSE_ORDER_REJECTED = 'CLOSE_ORDER_REJECTED'

// --- 账户
export const GET_ACCOUNTINFO = 'GET_ACCOUNTINFO',
             GET_ACCOUNTINFO_PENDING = 'GET_ACCOUNTINFO_PENDING',
             GET_ACCOUNTINFO_FULFILLED = 'GET_ACCOUNTINFO_FULFILLED',
             GET_ACCOUNTINFO_REJECTED = 'GET_ACCOUNTINFO_REJECTED'
export const SET_ACCOUNTINFO = 'SET_ACCOUNTINFO'