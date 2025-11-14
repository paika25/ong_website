import __nuxt_component_2 from './Button-BmnFf-22.mjs';
import __nuxt_component_1 from './index-V6vXsTPu.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_2;
      const _component_Icon = __nuxt_component_1;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "border-t py-12 bg-muted/30" }, _attrs))}><div class="container px-4 mx-auto"><div class="flex flex-col items-center justify-center space-y-6"><div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "ghost",
        size: "sm",
        class: "rounded-full hover:bg-primary/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:github",
              class: "h-5 w-5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Icon, {
                name: "lucide:github",
                class: "h-5 w-5"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "ghost",
        size: "sm",
        class: "rounded-full hover:bg-primary/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:linkedin",
              class: "h-5 w-5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Icon, {
                name: "lucide:linkedin",
                class: "h-5 w-5"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "ghost",
        size: "sm",
        class: "rounded-full hover:bg-primary/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:mail",
              class: "h-5 w-5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Icon, {
                name: "lucide:mail",
                class: "h-5 w-5"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="text-center text-sm text-muted-foreground"><p class="mb-2"> \xA9 ${ssrInterpolate(unref(currentYear))} Paika project. Tous droits r\xE9serv\xE9s. </p><p> D\xE9velopp\xE9 avec Vue.js, Nuxt.js &amp; Tailwind CSS </p></div></div></div></footer>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Footer-MFOnJ3Am.mjs.map
