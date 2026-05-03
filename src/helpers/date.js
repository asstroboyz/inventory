import { zeroFillFromNumber, zeroFillFromString } from "./zeroFill";
import moment from "moment";

// export function addDays(date, days) {
//     var result = new Date(date);
//     result.setDate(result.getDate() + days);
//     return result;
// }

export function dateIndo(d) {
    var curr_date = zeroFillFromNumber(d.getDate(), 2);
    var curr_month = zeroFillFromNumber(d.getMonth() + 1, 2)
    var curr_year = d.getFullYear();
    return (curr_date + "-" + curr_month + "-" + curr_year);
}

export function dateSQL(d) {
    var curr_date = zeroFillFromNumber(d.getDate(), 2);
    var curr_month = zeroFillFromNumber(d.getMonth() + 1, 2)
    var curr_year = d.getFullYear();
    return (curr_year + "-" + curr_month + "-" + curr_date);
}

export function dateEpoch(d) {
    return Math.round(d.getTime() / 1000)
}

export function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function dateDetail(date) {
    var d = new Date(date);
    return moment(d).format("YYYY-MM-DD HH:mm:ss")
}

export function dateToRfc(tgl) {
    return String(new Date(tgl).getFullYear()) + "-" + zeroFillFromString(String(new Date(tgl).getMonth() + 1), 2) + "-" + zeroFillFromString(String(new Date(tgl).getDate()), 2) + "T" + zeroFillFromString(String(new Date(tgl).getHours()), 2) + ":" + zeroFillFromString(String(new Date(tgl).getMinutes()), 2) + ":" + zeroFillFromString(String(new Date(tgl).getSeconds()), 2) + "+07:00"
}

export function dateAddHour(tgl, hour) {
    return String(new Date(tgl).getFullYear()) + "-" + zeroFillFromString(String(new Date(tgl).getMonth() + 1), 2) + "-" + zeroFillFromString(String(new Date(tgl).getDate()) + " " + hour, 2)
}

export function dateDiffDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export const calculateAge = (dateString) => { 
    const formatString = 'YYYYMMDDHHmmss';

    const dob = moment(dateString, formatString).format('DD-MM-YYYY');
    const age = moment().diff(moment(dateString, formatString), 'years');
    const months = moment().diff(moment(dateString, formatString), 'months') % 12;
    const days = moment().diff(moment(dateString, formatString), 'days') % 30;

    return `${dob} / ${age}Th ${months}Bln ${days}Hr`;
}
export function dateWithFormat(date, format = "DD-MM-YYYY"){
    var d = new Date(date);
    return moment(d).format(format)
}
