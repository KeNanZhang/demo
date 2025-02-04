/** */
;
layui.define(["jquery"], function (t) {
    var e = layui.jquery;
    !function (t) {
        function n(e, n, r) {
            var o = this;
            return this.on("click.pjax", e, function (e) {
                var i = t.extend({}, v(n, r));
                i.container || (i.container = t(this).attr("data-pjax") || o), a(e, i)
            })
        }

        function a(e, n, a) {
            a = v(n, a);
            var r = e.currentTarget;
            if ("A" !== r.tagName.toUpperCase())throw"$.fn.pjax or $.pjax.click requires an anchor element";
            if (!(e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || location.protocol !== r.protocol || location.hostname !== r.hostname || r.href.indexOf("#") > -1 && m(r) == m(location) || e.isDefaultPrevented())) {
                var i = {
                    url: r.href,
                    container: t(r).attr("data-pjax"),
                    target: r
                }, s = t.extend({}, i, a), c = t.Event("pjax:click");
                t(r).trigger(c, [s]), c.isDefaultPrevented() || (o(s), e.preventDefault(), t(r).trigger("pjax:clicked", [s]))
            }
        }

        function r(e, n, a) {
            a = v(n, a);
            var r = e.currentTarget;
            if ("FORM" !== r.tagName.toUpperCase())throw"$.pjax.submit requires a form element";
            var i = {type: r.method.toUpperCase(), url: r.action, container: t(r).attr("data-pjax"), target: r};
            if ("GET" !== i.type && void 0 !== window.FormData)i.data = new FormData(r), i.processData = !1, i.contentType = !1; else {
                if (t(r).find(":file").length)return;
                i.data = t(r).serializeArray()
            }
            o(t.extend({}, i, a)), e.preventDefault()
        }

        function o(e) {
            function n(e, n, r) {
                r || (r = {}), r.relatedTarget = a;
                var o = t.Event(e, r);
                return i.trigger(o, n), !o.isDefaultPrevented()
            }

            e = t.extend(!0, {}, t.ajaxSettings, o.defaults, e), t.isFunction(e.url) && (e.url = e.url());
            var a = e.target, r = h(e.url).hash, i = e.context = x(e.container);
            e.data || (e.data = {}), t.isArray(e.data) ? e.data.push({
                name: "_pjax",
                value: i.selector
            }) : e.data._pjax = i.selector;
            var c;
            e.beforeSend = function (t, a) {
                if ("GET" !== a.type && (a.timeout = 0), t.setRequestHeader("X-PJAX", "true"), t.setRequestHeader("X-PJAX-Container", i.selector), !n("pjax:beforeSend", [t, a]))return !1;
                a.timeout > 0 && (c = setTimeout(function () {
                    n("pjax:timeout", [t, e]) && t.abort("timeout")
                }, a.timeout), a.timeout = 0);
                var o = h(a.url);
                r && (o.hash = r), e.requestUrl = d(o)
            }, e.complete = function (t, a) {
                c && clearTimeout(c), n("pjax:complete", [t, a, e]), n("pjax:end", [t, e])
            }, e.error = function (t, a, r) {
                var o = y("", t, e), i = n("pjax:error", [t, a, r, e]);
                "GET" == e.type && "abort" !== a && i && s(o.url)
            }, e.success = function (a, c, u) {
                var l = o.state, f = "function" == typeof t.pjax.defaults.version ? t.pjax.defaults.version() : t.pjax.defaults.version, d = u.getResponseHeader("X-PJAX-Version"), m = y(a, u, e), v = h(m.url);
                if (r && (v.hash = r, m.url = v.href), f && d && f !== d)s(m.url); else if (m.contents) {
                    o.state = {
                        id: e.id || p(),
                        url: m.url,
                        title: m.title,
                        container: i.selector,
                        fragment: e.fragment,
                        timeout: e.timeout
                    }, (e.push || e.replace) && window.history.replaceState(o.state, m.title, m.url);
                    try {
                        document.activeElement.blur()
                    } catch (t) {
                    }
                    m.title && (document.title = m.title), n("pjax:beforeReplace", [m.contents, e], {
                        state: o.state,
                        previousState: l
                    }), i.html(m.contents);
                    var x = i.find("input[autofocus], textarea[autofocus]").last()[0];
                    x && document.activeElement !== x && x.focus(), w(m.scripts);
                    var g = e.scrollTo;
                    if (r) {
                        var j = decodeURIComponent(r.slice(1)), b = document.getElementById(j) || document.getElementsByName(j)[0];
                        b && (g = t(b).offset().top)
                    }
                    "number" == typeof g && t(window).scrollTop(g), n("pjax:success", [a, c, u, e])
                } else s(m.url)
            }, o.state || (o.state = {
                id: p(),
                url: window.location.href,
                title: document.title,
                container: i.selector,
                fragment: e.fragment,
                timeout: e.timeout
            }, window.history.replaceState(o.state, document.title)), l(o.xhr), o.options = e;
            var u = o.xhr = t.ajax(e);
            return u.readyState > 0 && (e.push && !e.replace && (b(o.state.id, f(i)), window.history.pushState(null, "", e.requestUrl)), n("pjax:start", [u, e]), n("pjax:send", [u, e])), o.xhr
        }

        function i(e, n) {
            var a = {url: window.location.href, push: !1, replace: !0, scrollTo: !1};
            return o(t.extend(a, v(e, n)))
        }

        function s(t) {
            window.history.replaceState(null, "", o.state.url), window.location.replace(t)
        }

        function c(e) {
            A || l(o.xhr);
            var n, a = o.state, r = e.state;
            if (r && r.container) {
                if (A && q == r.url)return;
                if (a) {
                    if (a.id === r.id)return;
                    n = a.id < r.id ? "forward" : "back"
                }
                var i = R[r.id] || [], c = t(i[0] || r.container), u = i[1];
                if (c.length) {
                    a && T(n, a.id, f(c));
                    var p = t.Event("pjax:popstate", {state: r, direction: n});
                    c.trigger(p);
                    var d = {
                        id: r.id,
                        url: r.url,
                        container: c,
                        push: !1,
                        fragment: r.fragment,
                        timeout: r.timeout,
                        scrollTo: !1
                    };
                    if (u) {
                        c.trigger("pjax:start", [null, d]), o.state = r, r.title && (document.title = r.title);
                        var h = t.Event("pjax:beforeReplace", {state: r, previousState: a});
                        c.trigger(h, [u, d]), c.html(u), c.trigger("pjax:end", [null, d])
                    } else o(d);
                    c[0].offsetHeight
                } else s(location.href)
            }
            A = !1
        }

        function u(e) {
            var n = t.isFunction(e.url) ? e.url() : e.url, a = e.type ? e.type.toUpperCase() : "GET", r = t("<form>", {
                method: "GET" === a ? "GET" : "POST",
                action: n,
                style: "display:none"
            });
            "GET" !== a && "POST" !== a && r.append(t("<input>", {
                type: "hidden",
                name: "_method",
                value: a.toLowerCase()
            }));
            var o = e.data;
            if ("string" == typeof o)t.each(o.split("&"), function (e, n) {
                var a = n.split("=");
                r.append(t("<input>", {type: "hidden", name: a[0], value: a[1]}))
            }); else if (t.isArray(o))t.each(o, function (e, n) {
                r.append(t("<input>", {type: "hidden", name: n.name, value: n.value}))
            }); else if ("object" == typeof o) {
                var i;
                for (i in o)r.append(t("<input>", {type: "hidden", name: i, value: o[i]}))
            }
            t(document.body).append(r), r.submit()
        }

        function l(e) {
            e && e.readyState < 4 && (e.onreadystatechange = t.noop, e.abort())
        }

        function p() {
            return (new Date).getTime()
        }

        function f(t) {
            var n = t.clone();
            return n.find("script").each(function () {
                this.src || e._data(this, "globalEval", !1)
            }), [t.selector, n.contents()]
        }

        function d(t) {
            return t.search = t.search.replace(/([?&])(_pjax|_)=[^&]*/g, ""), t.href.replace(/\?($|#)/, "$1")
        }

        function h(t) {
            var e = document.createElement("a");
            return e.href = t, e
        }

        function m(t) {
            return t.href.replace(/#.*/, "")
        }

        function v(e, n) {
            return e && n ? n.container = e : n = t.isPlainObject(e) ? e : {container: e}, n.container && (n.container = x(n.container)), n
        }

        function x(e) {
            if ((e = t(e)).length) {
                if ("" !== e.selector && e.context === document)return e;
                if (e.attr("id"))return t("#" + e.attr("id"));
                throw"cant get selector for pjax container!"
            }
            throw"no pjax container for " + e.selector
        }

        function g(t, e) {
            return t.filter(e).add(t.find(e))
        }

        function j(e) {
            return t.parseHTML(e, document, !0)
        }

        function y(e, n, a) {
            var r = {}, o = /<html/i.test(e), i = n.getResponseHeader("X-PJAX-URL");
            if (r.url = i ? d(h(i)) : a.requestUrl, o)var s = t(j(e.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0])), c = t(j(e.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0])); else s = c = t(j(e));
            if (0 === c.length)return r;
            if (r.title = g(s, "title").last().text(), a.fragment) {
                if ("body" === a.fragment)u = c; else var u = g(c, a.fragment).first();
                u.length && (r.contents = "body" === a.fragment ? u : u.contents(), r.title || (r.title = u.attr("title") || u.data("title")))
            } else o || (r.contents = c);
            return r.contents && (r.contents = r.contents.not(function () {
                return t(this).is("title")
            }), r.contents.find("title").remove(), r.scripts = g(r.contents, "script[src]").remove(), r.contents = r.contents.not(r.scripts)), r.title && (r.title = t.trim(r.title)), r
        }

        function w(e) {
            if (e) {
                var n = t("script[src]");
                e.each(function () {
                    var e = this.src;
                    if (!n.filter(function () {
                            return this.src === e
                        }).length) {
                        var a = document.createElement("script"), r = t(this).attr("type");
                        r && (a.type = r), a.src = t(this).attr("src"), document.head.appendChild(a)
                    }
                })
            }
        }

        function b(t, e) {
            R[t] = e, X.push(t), E(U, 0), E(X, o.defaults.maxCacheLength)
        }

        function T(t, e, n) {
            var a, r;
            R[e] = n, "forward" === t ? (a = X, r = U) : (a = U, r = X), a.push(e), (e = r.pop()) && delete R[e], E(a, o.defaults.maxCacheLength)
        }

        function E(t, e) {
            for (; t.length > e;)delete R[t.shift()]
        }

        function S() {
            return t("meta").filter(function () {
                var e = t(this).attr("http-equiv");
                return e && "X-PJAX-VERSION" === e.toUpperCase()
            }).attr("content")
        }

        function P() {
            t.fn.pjax = n, t.pjax = o, t.pjax.enable = t.noop, t.pjax.disable = C, t.pjax.click = a, t.pjax.submit = r, t.pjax.reload = i, t.pjax.defaults = {
                timeout: 650,
                push: !0,
                replace: !1,
                type: "GET",
                dataType: "html",
                scrollTo: 0,
                maxCacheLength: 20,
                version: S
            }, t(window).on("popstate.pjax", c)
        }

        function C() {
            t.fn.pjax = function () {
                return this
            }, t.pjax = u, t.pjax.enable = P, t.pjax.disable = t.noop, t.pjax.click = t.noop, t.pjax.submit = t.noop, t.pjax.reload = function () {
                window.location.reload()
            }, t(window).off("popstate.pjax", c)
        }

        var A = !0, q = window.location.href, D = window.history.state;
        D && D.container && (o.state = D), "state"in window.history && (A = !1);
        var R = {}, U = [], X = [];
        t.inArray("state", t.event.props) < 0 && t.event.props.push("state"), t.support.pjax = window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/), t.support.pjax ? P() : C()
    }(e), t("pjax")
});