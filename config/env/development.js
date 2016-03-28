module.exports = {
    // development configuration options
    sessionSecret: "developmentSessionSecret",
    db: "mongodb://127.0.0.1/wei-bbs-development",
    statics: "statics",
    staticsOptions: {
        dotfiles: 'ignore',
        etag: true,
        extensions: ['htm', 'html'],
        index: false,
        maxAge: '0',
        redirect: false,
        setHeaders: function(res, path, stat) {
            res.set('x-timestamp', Date.now());
        }
    },
    xss: {
        whiteList: {
            "a": ["target", "href", "title", "style"],
            "abbr": ["title", "style"],
            "address": ["style"],
            "area": ["shape", "coords", "href", "alt", "style"],
            "article": ["style"],
            "aside": ["style"],
            "audio": ["autoplay", "controls", "loop", "preload", "src", "style"],
            "b": ["style"],
            "bdi": ["dir", "style"],
            "bdo": ["dir", "style"],
            "big": ["style"],
            "blockquote": ["cite", "style"],
            "br": ["style"],
            "caption": ["style"],
            "center": ["style"],
            "cite": ["style"],
            "code": ["style"],
            "col": ["align", "valign", "span", "width", "style"],
            "colgroup": ["align", "valign", "span", "width", "style"],
            "dd": ["style"],
            "del": ["datetime", "style"],
            "details": ["open", "style"],
            "div": ["style"],
            "dl": ["style"],
            "dt": ["style"],
            "em": ["style"],
            "font": ["color", "size", "face", "style"],
            "footer": ["style"],
            "h1": ["style"],
            "h2": ["style"],
            "h3": ["style"],
            "h4": ["style"],
            "h5": ["style"],
            "h6": ["style"],
            "header": ["style"],
            "hr": ["style"],
            "i": ["style"],
            "img": ["src", "alt", "title", "width", "height", "style"],
            "ins": ["datetime", "style"],
            "li": ["style"],
            "mark": ["style"],
            "nav": ["style"],
            "ol": ["style"],
            "p": ["style"],
            "pre": ["style"],
            "s": ["style"],
            "section": ["style"],
            "small": ["style"],
            "span": ["style"],
            "sub": ["style"],
            "sup": ["style"],
            "strong": ["style"],
            "table": ["width", "border", "align", "valign", "style"],
            "tbody": ["align", "valign", "style"],
            "td": ["width", "colspan", "align", "valign", "style"],
            "tfoot": ["align", "valign", "style"],
            "th": ["width", "colspan", "align", "valign", "style"],
            "thead": ["align", "valign", "style"],
            "tr": ["rowspan", "align", "valign", "style"],
            "tt": ["style"],
            "u": ["style"],
            "ul": ["style"],
            "video": ["autoplay", "controls", "loop", "preload", "src", "height", "width", "style"]

        }
    },
    port: 3000
};