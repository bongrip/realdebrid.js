const unirest = require('unirest');

let BASE_URL = 'https://api.real-debrid.com/rest/1.0';

class Debrid {
    constructor(token) {
        this.token = token;
    }

    disable_access_token() {
        return this._request('GET', `${BASE_URL}/disable_access_token`)
            .then(res => res.status === 204);
    }

    time() {
        return this._request('GET', `${BASE_URL}/time`)
            .then(res => res.body);
    }

    time_iso() {
        return this._request('GET', `${BASE_URL}/time/iso`)
            .then(res => res.body);
    }

    user() {
        return this._request('GET', `${BASE_URL}/user`)
            .then(res => res.body);
    }

    unrestrict_check(link, password = '') {
        return this._request('POST', `${BASE_URL}/unrestrict/check`, { link, password }, false)
            .then(res => res.body);
    }

    unrestrict_link(link, password = '', remote = 0) {
        return this._request('POST', `${BASE_URL}/unrestrict/link`, { link, password, remote })
            .then(res => res.body);
    }

    unrestrict_folder(link) {
        return this._request('POST', `${BASE_URL}/unrestrict/folder`, { link })
            .then(res => res.body);
    }

    decrypt_container(file) {
        return this._request('POST', `${BASE_URL}/decrypt/container`, { file })
            .then(res => res.body);
    }

    traffic_info() {
        return this._request('GET', `${BASE_URL}/traffic`)
            .then(res => res.body);
    }

    traffic_details(start, end) {
        const params = {};
        if (start) params.start = start;
        if (end) params.end = end;

        return this._request('GET', `${BASE_URL}/traffic/details`, params)
            .then(res => res.body);
    }

    get_transcoding_links(id) {
        return this._request('GET', `${BASE_URL}/streaming/transcode/${id}`)
            .then(res => res.body);
    }

    get_media_info(id) {
        return this._request('GET', `${BASE_URL}/streaming/mediaInfos/${id}`)
            .then(res => res.body);
    }

    get_downloads_list(offset = 0, page = null, limit = 100) {
        const params = { offset, limit };
        if (page) params.page = page;

        return this._request('GET', `${BASE_URL}/downloads`, params)
            .then(res => res.body);
    }

    delete_download(id) {
        return this._request('DELETE', `${BASE_URL}/downloads/delete/${id}`)
            .then(res => res.status === 204);
    }

    get_torrents_list(offset = 0, page = null, limit = 100, filter = null) {
        const params = { offset, limit };
        if (page) params.page = page;
        if (filter) params.filter = filter;

        return this._request('GET', `${BASE_URL}/torrents`, params)
            .then(res => res.body);
    }

    get_torrent_info(id) {
        return this._request('GET', `${BASE_URL}/torrents/info/${id}`)
            .then(res => res.body);
    }

    check_instant_availability(...hashes) {
        const hashPath = hashes.join('/');
        return this._request('GET', `${BASE_URL}/torrents/instantAvailability/${hashPath}`)
            .then(res => res.body);
    }

    get_active_torrent_count() {
        return this._request('GET', `${BASE_URL}/torrents/activeCount`)
            .then(res => res.body);
    }

    get_available_hosts() {
        return this._request('GET', `${BASE_URL}/torrents/availableHosts`)
            .then(res => res.body);
    }

    add_torrent(host) {
        return this._request('PUT', `${BASE_URL}/torrents/addTorrent`, { host })
            .then(res => res.body);
    }

    add_magnet_link(magnet, host) {
        return this._request('POST', `${BASE_URL}/torrents/addMagnet`, { magnet, host })
            .then(res => res.body);
    }

    select_files(id, files = "all") {
        return this._request('POST', `${BASE_URL}/torrents/selectFiles/${id}`, { files })
            .then(res => res.status === 204);
    }

    delete_torrent(id) {
        return this._request('DELETE', `${BASE_URL}/torrents/delete/${id}`)
            .then(res => res.status === 204);
    }

    get_supported_hosts() {
        return this._request('GET', `${BASE_URL}/hosts`, {}, false)
            .then(res => res.body);
    }

    get_host_status() {
        return this._request('GET', `${BASE_URL}/hosts/status`, {}, false)
            .then(res => res.body);
    }

    get_supported_regex() {
        return this._request('GET', `${BASE_URL}/hosts/regex`, {}, false)
            .then(res => res.body);
    }

    get_supported_regex_folder() {
        return this._request('GET', `${BASE_URL}/hosts/regexFolder`, {}, false)
            .then(res => res.body);
    }

    get_supported_domains() {
        return this._request('GET', `${BASE_URL}/hosts/domains`, {}, false)
            .then(res => res.body);
    }

    get_user_settings() {
        return this._request('GET', `${BASE_URL}/settings`)
            .then(res => res.body);
    }

    update_user_setting(setting_name, setting_value) {
        const data = { setting_name, setting_value };
        return this._request('POST', `${BASE_URL}/settings/update`, data)
            .then(res => res.status === 204);
    }

    convert_points() {
        return this._request('POST', `${BASE_URL}/settings/convertPoints`)
            .then(res => res.status === 204);
    }

    change_password() {
        return this._request('POST', `${BASE_URL}/settings/changePassword`)
            .then(res => res.status === 204);
    }

    upload_avatar(avatarFile) {
        return this._request('PUT', `${BASE_URL}/settings/avatarFile`, { avatarFile })
            .then(res => res.status === 204);
    }

    reset_avatar() {
        return this._request('DELETE', `${BASE_URL}/settings/avatarDelete`)
            .then(res => res.status === 204);
    }

    _request(method, url, data = {}, auth = true) {
        return new Promise((resolve, reject) => {
            const req = unirest(method, url);

            if (auth) {
                req.headers({
                    "Authorization": `Bearer ${this.token}`
                });
            }

            if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
                req.type('form').send(data);
            } else if (method === 'GET' && Object.keys(data).length > 0) {
                req.query(data);
            }

            req.end((res) => {
                if (res.error) {
                    reject(res.error);
                } else {
                    resolve(res);
                }
            });
        });
    }
}

module.exports = Debrid;
