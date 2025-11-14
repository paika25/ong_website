import { _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    ref(true);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`<main class="flex-grow container mx-auto px-4 py-8">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ongs/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CrNnGXty.mjs.map
