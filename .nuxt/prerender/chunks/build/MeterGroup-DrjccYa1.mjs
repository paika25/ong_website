import { defineComponent, toRef, computed, cloneVNode, h } from 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/vue/index.mjs';
import { twJoin } from 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/tailwind-merge/dist/bundle-mjs.mjs';
import __nuxt_component_0 from './Icon-ButdRDWp.mjs';
import { u as useUI } from './tooltip-CDOMCEew.mjs';
import { m as mergeConfig, g as getSlotsChildren, a as appConfig } from './server.mjs';
import { m as meter } from './meter-B60JAxnv.mjs';
import './index-V6vXsTPu.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/@iconify/vue/dist/iconify.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/@iconify/utils/lib/css/icon.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/nuxt/node_modules/perfect-debounce/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/vue/server-renderer/index.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import '../_/renderer.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unhead/dist/server.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/devalue/index.js';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unhead/dist/utils.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unhead/dist/plugins.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/nuxt/node_modules/pathe/dist/index.mjs';

const meterGroup = {
  wrapper: "flex flex-col gap-2 w-full",
  base: "flex flex-row flex-nowrap flex-shrink overflow-hidden",
  background: "bg-gray-200 dark:bg-gray-700",
  transition: "transition-all",
  rounded: "rounded-full",
  shadow: "",
  list: "list-disc list-inside",
  orientation: {
    "rounded-none": { left: "rounded-s-none", right: "rounded-e-none" },
    "rounded-sm": { left: "rounded-s-sm", right: "rounded-e-sm" },
    "rounded": { left: "rounded-s", right: "rounded-e" },
    "rounded-md": { left: "rounded-s-md", right: "rounded-e-md" },
    "rounded-lg": { left: "rounded-s-lg", right: "rounded-e-lg" },
    "rounded-xl": { left: "rounded-s-xl", right: "rounded-e-xl" },
    "rounded-2xl": { left: "rounded-s-2xl", right: "rounded-e-2xl" },
    "rounded-3xl": { left: "rounded-s-3xl", right: "rounded-e-3xl" },
    "rounded-full": { left: "rounded-s-full", right: "rounded-e-full" }
  },
  default: {
    size: "md",
    icon: "i-heroicons-minus-20-solid"
  }
};
const meterConfig = mergeConfig(appConfig.ui.strategy, appConfig.ui.meter, meter);
const meterGroupConfig = mergeConfig(appConfig.ui.strategy, appConfig.ui.meterGroup, meterGroup);
const MeterGroup = defineComponent({
  components: {
    UIcon: __nuxt_component_0
  },
  inheritAttrs: false,
  slots: Object,
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    size: {
      type: String,
      default: () => meterConfig.default.size,
      validator(value) {
        return Object.keys(meterConfig.meter.bar.size).includes(value);
      }
    },
    indicator: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: () => meterGroupConfig.default.icon
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
  setup(props, { slots }) {
    const { ui, attrs } = useUI("meterGroup", toRef(props, "ui"), meterGroupConfig);
    const { ui: uiMeter } = useUI("meter", void 0, meterConfig);
    if (!slots.default) {
      throw new Error("Meter Group has no Meter children.");
    }
    const normalizedMin = computed(() => props.min > props.max ? props.max : props.min);
    const normalizedMax = computed(() => props.max < props.min ? props.min : props.max);
    const children = computed(() => getSlotsChildren(slots));
    const rounded = computed(() => ui.value.orientation[ui.value.rounded]);
    function clampPercent(value, min, max) {
      if (min == max) {
        return value < min ? 0 : 100;
      }
      if (min > max) {
        max = [min, min = max][0];
      }
      const percent2 = (value - min) / (max - min) * 100;
      return Math.max(0, Math.min(100, percent2));
    }
    const labels = computed(() => {
      return children.value.map((node) => node.props.label);
    });
    const percents = computed(() => {
      return children.value.map((node) => clampPercent(node.props.value, props.min, props.max));
    });
    const percent = computed(() => {
      return Math.max(0, Math.max(percents.value.reduce((prev, percent2) => prev + percent2, 0)));
    });
    const clones = computed(() => children.value.map((node, index) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
      const vProps = {};
      vProps.style = { width: `${percents.value[index]}%` };
      vProps.size = props.size;
      vProps.min = normalizedMin.value;
      vProps.max = normalizedMax.value;
      vProps.ui = ((_a = node.props) == null ? void 0 : _a.ui) || {};
      vProps.ui.wrapper = ((_c = (_b = node.props) == null ? void 0 : _b.ui) == null ? void 0 : _c.wrapper) || "";
      vProps.ui.wrapper += [
        (_e = (_d = node.props) == null ? void 0 : _d.ui) == null ? void 0 : _e.wrapper,
        ui.value.background,
        ui.value.transition
      ].filter(Boolean).join(" ");
      vProps.ui.meter = ((_g = (_f = node.props) == null ? void 0 : _f.ui) == null ? void 0 : _g.meter) || {};
      vProps.ui.meter.background = `bg-${node.props.color}-500 dark:bg-${node.props.color}-400`;
      vProps.ui.meter.rounded = "rounded-none";
      vProps.ui.meter.bar = ((_j = (_i = (_h = node.props) == null ? void 0 : _h.ui) == null ? void 0 : _i.meter) == null ? void 0 : _j.bar) || {};
      if (index === 0) {
        vProps.ui.meter.rounded = `${rounded.value.left} rounded-e-none`;
      }
      if (index === children.value.length - 1) {
        vProps.ui.meter.rounded = `${rounded.value.right} rounded-s-none`;
      }
      labels.value[index] = node.props.label;
      const clone = cloneVNode(node, vProps);
      (_k = clone.children) == null ? true : delete _k.label;
      (_l = clone.props) == null ? true : delete _l.indicator;
      (_m = clone.props) == null ? true : delete _m.label;
      return clone;
    }));
    const baseClass = computed(() => {
      return twJoin(
        ui.value.base,
        ui.value.background,
        ui.value.rounded,
        ui.value.shadow,
        uiMeter.value.meter.size[props.size]
      );
    });
    const indicatorContainerClass = computed(() => {
      return twJoin(
        uiMeter.value.indicator.container
      );
    });
    const indicatorClass = computed(() => {
      return twJoin(
        uiMeter.value.indicator.text,
        uiMeter.value.indicator.size[props.size]
      );
    });
    const vNodeChildren = computed(() => {
      const vNodeSlots = [
        void 0,
        h("div", { class: baseClass.value }, clones.value),
        void 0
      ];
      if (props.indicator) {
        vNodeSlots[0] = h("div", { class: indicatorContainerClass.value }, [
          h("div", { class: indicatorClass.value, style: { width: `${percent.value}%` } }, Math.round(percent.value) + "%")
        ]);
      } else if (slots.indicator) {
        vNodeSlots[0] = slots.indicator({ percent: percent.value });
      }
      vNodeSlots[2] = h("ol", { class: ui.value.list }, labels.value.map((label, key) => {
        var _a, _b;
        const labelClass = computed(() => {
          var _a2, _b2, _c, _d;
          return twJoin(
            uiMeter.value.label.base,
            uiMeter.value.label.text,
            (_d = uiMeter.value.color[(_a2 = clones.value[key]) == null ? void 0 : _a2.props.color]) != null ? _d : uiMeter.value.label.color.replaceAll("{color}", (_c = (_b2 = clones.value[key]) == null ? void 0 : _b2.props.color) != null ? _c : uiMeter.value.default.color),
            uiMeter.value.label.size[props.size]
          );
        });
        return h("li", { class: labelClass.value }, [
          h(__nuxt_component_0, { name: (_b = (_a = clones.value[key]) == null ? void 0 : _a.props.icon) != null ? _b : props.icon }),
          `${label} (${Math.round(percents.value[key])}%)`
        ]);
      }));
      return vNodeSlots;
    });
    return () => h("div", { class: ui.value.wrapper, ...attrs.value }, vNodeChildren.value);
  }
});

export { MeterGroup as default };
//# sourceMappingURL=MeterGroup-DrjccYa1.mjs.map
