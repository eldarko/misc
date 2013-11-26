// ==UserScript==
// @name     OdnoklassnikiUsageStatistics
// @author   eldarko
// @include  http://*.odnoklassniki.ru/
// @include  http://odnoklassniki.ru/
// @require  http://code.jquery.com/jquery-1.10.2.min.js
// ==/UserScript==

function update_stat_view(todayMinutes, weekHours)
{
    $('#usage_stat').html(' ' + todayMinutes + ' ' + weekHours)
}

var usage_flag = false
var period     = 10 // 10 seconds

function check_usage()
{
    if(usage_flag)
    {
        update_stat()
        usage_flag = false
    }
}

function update_stat()
{
    var lastDay = window.localStorage['usage_stat_last_day']
    var stats   = window.localStorage['usage_stat_data']

    try {
        stats = JSON.parse(stats)
    }
    catch(e) {
        stats = [0,0,0,0,0,0,0]
    }

    var currentDay = Math.floor(new Date().getTime() / 86400000);

    if(lastDay == null)
        lastDay = currentDay

    console.log(stats)
    console.log(lastDay)
    console.log(currentDay)

    var daysToRemove  = currentDay - lastDay
   	for(var i = 0; i < Math.min(7, daysToRemove); i++)
       stats.unshift(0)

    stats.length = 7 // truncate

    stats[0]++

    window.localStorage['usage_stat_last_day'] = currentDay
    window.localStorage['usage_stat_data']     = JSON.stringify(stats)

    todayMinutes = stats[0] / (60 / period)
    weekHours = 0
    for(var i = 0; i < stats.length; i++)
        weekHours += stats[i]

    weekHours /= (3600 / period)

    update_stat_view(Math.round(todayMinutes), Math.round(weekHours))
}

function action_detected()
{
    usage_flag = true
}

$(function(){
    $('#portal-headline_login').append('<span id="usage_stat"></span>')
    $(window).scroll(action_detected)
    $(window).mousemove(action_detected)
    window.setInterval(check_usage, period * 1000)
})
