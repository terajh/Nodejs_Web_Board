module.exports = {
    IsOwner: function(req, res) {
        if (req.user != undefined) {
            return true;
        } else {
            return false;
        }
    },

    statusUI: function(req, res) {
        if (this.IsOwner(req, res))
            return req.user.nickname;
        else return 'login';
    }
}