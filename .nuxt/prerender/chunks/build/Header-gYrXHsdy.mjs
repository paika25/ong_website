import { _ as __nuxt_component_0 } from './nuxt-link-8Ths6Lqw.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createBlock, openBlock, useSSRContext } from 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/vue/server-renderer/index.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "bg-slate-950 shadow-sm sticky top-0 z-10" }, _attrs))}><div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between"><div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7-4.978-10-8.2C-1.02 9.17 3.03 3 7.5 6.5 9.6 8.34 12 10.2 12 10.2s2.4-1.86 4.5-3.7C20.97 3 25.02 9.17 22 12.8 19 16.022 12 21 12 21z"></path></svg><h1 class="text-xl font-bold text-gray-800">Trouve ton ONG</h1></div><div class="flex items-center space-x-4"><div class="relative"><input type="text" placeholder="Rechercher une ONG..." class="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-red-500"><svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-3 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"></path></svg></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/profil",
        class: "flex items-center space-x-1 text-gray-600 hover:text-red-600",
        "aria-label": "Profil",
        title: "Profil"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img class="w-[40px] h-[40px] rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                class: "w-[40px] h-[40px] rounded-full",
                src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/login",
        class: "flex items-center space-x-1 text-gray-600 hover:text-red-600",
        "aria-label": "Profil",
        title: "Profil"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "w-6 h-6",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "aria-hidden": "true"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></header>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Header-gYrXHsdy.mjs.map
