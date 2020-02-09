module.exports = {
    list: function(topic) {
        var list = '<ul>';
        var i = 0;
        while (i < topic.length) {
            list = list + `<li><a href="/topic/${topic[i].id}">${topic[i].title}</a></li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        return list;
    }

}