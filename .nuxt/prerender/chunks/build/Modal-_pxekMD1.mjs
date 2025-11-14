import { defineComponent, resolveComponent, mergeProps, withCtx, createVNode, renderSlot, createBlock, createCommentVNode, openBlock, toRef, computed, useId, useSSRContext } from 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/vue/index.mjs';
import { h as he, S as Se, G as Ge, Y as Ye } from './transition-SVkoAT_R.mjs';
import { s } from './keyboard-Duq8EHr3.mjs';
import { u as useUI } from './tooltip-CDOMCEew.mjs';
import { m as mergeConfig, a as appConfig } from './server.mjs';
import { ssrRenderComponent, ssrRenderClass, ssrRenderSlot } from 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './portal-BoVYkj6E.mjs';
import './focus-management-vHH7q6nP.mjs';
import './use-outside-click-DgYwH73n.mjs';
import './hidden-Dc_fFmis.mjs';
import './active-element-history-Cer4cSOw.mjs';
import './micro-task-B6uncIso.mjs';
import './open-closed-BDzQJ33n.mjs';
import './description-BmqggpRU.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/ofetch/dist/node.mjs';
import '../nitro/nitro.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/h3/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/ufo/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/destr/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/hookable/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/node-mock-http/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unstorage/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unstorage/drivers/fs.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/nitropack/node_modules/ohash/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/klona/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/defu/dist/defu.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/scule/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unctx/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/pathe/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/@nuxt/icon/node_modules/pathe/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/@iconify/utils/lib/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/@nuxt/icon/node_modules/ohash/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/consola/dist/index.mjs';
import 'node:module';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/pinia/dist/pinia.prod.cjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/vue-router/vue-router.node.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/tailwind-merge/dist/bundle-mjs.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/@iconify/vue/dist/iconify.mjs';
import '../_/renderer.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unhead/dist/server.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/devalue/index.js';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unhead/dist/utils.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unhead/dist/plugins.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/nuxt/node_modules/pathe/dist/index.mjs';

const modal = {
  wrapper: "relative z-50",
  inner: "fixed inset-0 overflow-y-auto",
  container: "flex min-h-full items-end sm:items-center justify-center text-center",
  padding: "p-4 sm:p-0",
  margin: "sm:my-8",
  base: "relative text-left rtl:text-right flex flex-col",
  overlay: {
    base: "fixed inset-0 transition-opacity",
    background: "bg-gray-200/75 dark:bg-gray-800/75",
    // Syntax for `<TransitionRoot>` component https://headlessui.com/v1/vue/transition#basic-example
    transition: {
      enter: "ease-out duration-300",
      enterFrom: "opacity-0",
      enterTo: "opacity-100",
      leave: "ease-in duration-200",
      leaveFrom: "opacity-100",
      leaveTo: "opacity-0"
    }
  },
  background: "bg-white dark:bg-gray-900",
  ring: "",
  rounded: "rounded-lg",
  shadow: "shadow-xl",
  width: "w-full sm:max-w-lg",
  height: "",
  fullscreen: "w-screen h-screen",
  // Syntax for `<TransitionRoot>` component https://headlessui.com/v1/vue/transition#basic-example
  transition: {
    enter: "ease-out duration-300",
    enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
    enterTo: "opacity-100 translate-y-0 sm:scale-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
    leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  }
};
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.modal, modal);
const _sfc_main = defineComponent({
  components: {
    HDialog: Ye,
    HDialogPanel: Ge,
    TransitionRoot: Se,
    TransitionChild: he
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    appear: {
      type: Boolean,
      default: false
    },
    overlay: {
      type: Boolean,
      default: true
    },
    transition: {
      type: Boolean,
      default: true
    },
    preventClose: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue", "close", "close-prevented", "after-leave"],
  setup(props, { emit }) {
    const { ui, attrs } = useUI("modal", toRef(props, "ui"), config, toRef(props, "class"));
    const isOpen = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      }
    });
    const transitionClass = computed(() => {
      if (!props.transition) {
        return {};
      }
      return {
        ...ui.value.transition
      };
    });
    function close(value) {
      if (props.preventClose) {
        emit("close-prevented");
        return;
      }
      isOpen.value = value;
      emit("close");
    }
    const onAfterLeave = () => {
      emit("after-leave");
    };
    s(() => useId());
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      isOpen,
      transitionClass,
      onAfterLeave,
      close
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TransitionRoot = resolveComponent("TransitionRoot");
  const _component_HDialog = resolveComponent("HDialog");
  const _component_TransitionChild = resolveComponent("TransitionChild");
  const _component_HDialogPanel = resolveComponent("HDialogPanel");
  _push(ssrRenderComponent(_component_TransitionRoot, mergeProps({
    appear: _ctx.appear,
    show: _ctx.isOpen,
    as: "template",
    onAfterLeave: _ctx.onAfterLeave
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_HDialog, mergeProps({
          class: _ctx.ui.wrapper
        }, _ctx.attrs, { onClose: _ctx.close }), {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              if (_ctx.overlay) {
                _push3(ssrRenderComponent(_component_TransitionChild, mergeProps({
                  as: "template",
                  appear: _ctx.appear
                }, _ctx.ui.overlay.transition, {
                  class: _ctx.ui.overlay.transition.enterFrom
                }), {
                  default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      _push4(`<div class="${ssrRenderClass([_ctx.ui.overlay.base, _ctx.ui.overlay.background])}"${_scopeId3}></div>`);
                    } else {
                      return [
                        createVNode("div", {
                          class: [_ctx.ui.overlay.base, _ctx.ui.overlay.background]
                        }, null, 2)
                      ];
                    }
                  }),
                  _: 1
                }, _parent3, _scopeId2));
              } else {
                _push3(`<!---->`);
              }
              _push3(`<div class="${ssrRenderClass(_ctx.ui.inner)}"${_scopeId2}><div class="${ssrRenderClass([_ctx.ui.container, !_ctx.fullscreen && _ctx.ui.padding])}"${_scopeId2}>`);
              _push3(ssrRenderComponent(_component_TransitionChild, mergeProps({
                as: "template",
                appear: _ctx.appear
              }, _ctx.transitionClass, {
                class: _ctx.transitionClass.enterFrom
              }), {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(_component_HDialogPanel, {
                      class: [
                        _ctx.ui.base,
                        _ctx.ui.background,
                        _ctx.ui.ring,
                        _ctx.ui.shadow,
                        _ctx.fullscreen ? _ctx.ui.fullscreen : [_ctx.ui.width, _ctx.ui.height, _ctx.ui.rounded, _ctx.ui.margin]
                      ]
                    }, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push5, _parent5, _scopeId4);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "default")
                          ];
                        }
                      }),
                      _: 3
                    }, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(_component_HDialogPanel, {
                        class: [
                          _ctx.ui.base,
                          _ctx.ui.background,
                          _ctx.ui.ring,
                          _ctx.ui.shadow,
                          _ctx.fullscreen ? _ctx.ui.fullscreen : [_ctx.ui.width, _ctx.ui.height, _ctx.ui.rounded, _ctx.ui.margin]
                        ]
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "default")
                        ]),
                        _: 3
                      }, 8, ["class"])
                    ];
                  }
                }),
                _: 3
              }, _parent3, _scopeId2));
              _push3(`</div></div>`);
            } else {
              return [
                _ctx.overlay ? (openBlock(), createBlock(_component_TransitionChild, mergeProps({
                  key: 0,
                  as: "template",
                  appear: _ctx.appear
                }, _ctx.ui.overlay.transition, {
                  class: _ctx.ui.overlay.transition.enterFrom
                }), {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: [_ctx.ui.overlay.base, _ctx.ui.overlay.background]
                    }, null, 2)
                  ]),
                  _: 1
                }, 16, ["appear", "class"])) : createCommentVNode("", true),
                createVNode("div", {
                  class: _ctx.ui.inner
                }, [
                  createVNode("div", {
                    class: [_ctx.ui.container, !_ctx.fullscreen && _ctx.ui.padding]
                  }, [
                    createVNode(_component_TransitionChild, mergeProps({
                      as: "template",
                      appear: _ctx.appear
                    }, _ctx.transitionClass, {
                      class: _ctx.transitionClass.enterFrom
                    }), {
                      default: withCtx(() => [
                        createVNode(_component_HDialogPanel, {
                          class: [
                            _ctx.ui.base,
                            _ctx.ui.background,
                            _ctx.ui.ring,
                            _ctx.ui.shadow,
                            _ctx.fullscreen ? _ctx.ui.fullscreen : [_ctx.ui.width, _ctx.ui.height, _ctx.ui.rounded, _ctx.ui.margin]
                          ]
                        }, {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "default")
                          ]),
                          _: 3
                        }, 8, ["class"])
                      ]),
                      _: 3
                    }, 16, ["appear", "class"])
                  ], 2)
                ], 2)
              ];
            }
          }),
          _: 3
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_HDialog, mergeProps({
            class: _ctx.ui.wrapper
          }, _ctx.attrs, { onClose: _ctx.close }), {
            default: withCtx(() => [
              _ctx.overlay ? (openBlock(), createBlock(_component_TransitionChild, mergeProps({
                key: 0,
                as: "template",
                appear: _ctx.appear
              }, _ctx.ui.overlay.transition, {
                class: _ctx.ui.overlay.transition.enterFrom
              }), {
                default: withCtx(() => [
                  createVNode("div", {
                    class: [_ctx.ui.overlay.base, _ctx.ui.overlay.background]
                  }, null, 2)
                ]),
                _: 1
              }, 16, ["appear", "class"])) : createCommentVNode("", true),
              createVNode("div", {
                class: _ctx.ui.inner
              }, [
                createVNode("div", {
                  class: [_ctx.ui.container, !_ctx.fullscreen && _ctx.ui.padding]
                }, [
                  createVNode(_component_TransitionChild, mergeProps({
                    as: "template",
                    appear: _ctx.appear
                  }, _ctx.transitionClass, {
                    class: _ctx.transitionClass.enterFrom
                  }), {
                    default: withCtx(() => [
                      createVNode(_component_HDialogPanel, {
                        class: [
                          _ctx.ui.base,
                          _ctx.ui.background,
                          _ctx.ui.ring,
                          _ctx.ui.shadow,
                          _ctx.fullscreen ? _ctx.ui.fullscreen : [_ctx.ui.width, _ctx.ui.height, _ctx.ui.rounded, _ctx.ui.margin]
                        ]
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "default")
                        ]),
                        _: 3
                      }, 8, ["class"])
                    ]),
                    _: 3
                  }, 16, ["appear", "class"])
                ], 2)
              ], 2)
            ]),
            _: 3
          }, 16, ["class", "onClose"])
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/Modal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Modal = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { Modal as default };
//# sourceMappingURL=Modal-_pxekMD1.mjs.map
