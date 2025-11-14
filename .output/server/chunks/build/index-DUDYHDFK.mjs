import { u as useHead, _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './Header-gYrXHsdy.mjs';
import { _ as _sfc_main$2 } from './Footer-MFOnJ3Am.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'node:module';
import 'pinia';
import 'vue-router';
import 'tailwind-merge';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './nuxt-link-8Ths6Lqw.mjs';
import './Button-BmnFf-22.mjs';
import './Link-5MhyFiho.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './link-Bz3Wc5MF.mjs';
import '../_/ohash.BvSMZzli.mjs';
import './Icon-ButdRDWp.mjs';
import './index-V6vXsTPu.mjs';
import '@iconify/utils/lib/css/icon';
import './tooltip-CDOMCEew.mjs';
import './useButtonGroup-CmlPsf0K.mjs';
import './button-Bz5rwL6o.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "ONGs - Portfolio Marius",
      meta: [
        { name: "description", content: "D\xE9couvrez les organisations \xE0 but non lucratif et rejoignez leurs projets" },
        { name: "keywords", content: "ONG, b\xE9n\xE9volat, associations, projets sociaux" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`<main class="flex-grow container mx-auto px-4 py-8"><div class="mb-8"><h1 class="text-4xl font-bold mb-2">Liste des ONGs</h1><p class="text-muted-foreground">D\xE9couvrez et rejoignez les organisations \xE0 but non lucratif</p></div>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center py-12"${_scopeId}><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"${_scopeId}></div><p class="mt-4 text-muted-foreground"${_scopeId}>Chargement des ONGs...</p></div>`);
          } else {
            return [
              createVNode("div", { class: "text-center py-12" }, [
                createVNode("div", { class: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" }),
                createVNode("p", { class: "mt-4 text-muted-foreground" }, "Chargement des ONGs...")
              ])
            ];
          }
        })
      }, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DUDYHDFK.mjs.map
