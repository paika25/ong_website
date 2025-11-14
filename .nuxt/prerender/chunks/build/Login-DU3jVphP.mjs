import { defineComponent, mergeProps, reactive, ref, computed, watch, withCtx, createVNode, createTextVNode, useSSRContext } from 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/vue/server-renderer/index.mjs';
import __nuxt_component_0 from './FormGroup-D5Jc2lyD.mjs';
import __nuxt_component_1 from './Input-Cc81M0T5.mjs';
import __nuxt_component_2 from './Button-BmnFf-22.mjs';
import __nuxt_component_0$1 from './Checkbox-DBSLX1T5.mjs';
import { n as navigateTo } from './server.mjs';
import './tooltip-CDOMCEew.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './Icon-ButdRDWp.mjs';
import './index-V6vXsTPu.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/@iconify/vue/dist/iconify.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/@iconify/utils/lib/css/icon.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/nuxt/node_modules/perfect-debounce/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/tailwind-merge/dist/bundle-mjs.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/defu/dist/defu.mjs';
import './useFormGroup-2eEELX00.mjs';
import './index-BLXEZ1Ia.mjs';
import './useButtonGroup-CmlPsf0K.mjs';
import './Link-5MhyFiho.mjs';
import './nuxt-link-8Ths6Lqw.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/ufo/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/ohash/dist/utils.mjs';
import './link-Bz3Wc5MF.mjs';
import './button-Bz5rwL6o.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/ofetch/dist/node.mjs';
import '../nitro/nitro.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/h3/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/destr/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/hookable/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/node-mock-http/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unstorage/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unstorage/drivers/fs.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/nitropack/node_modules/ohash/dist/index.mjs';
import 'file:///home/marius/Documents/Project/nuxt-folio/node_modules/klona/dist/index.mjs';
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

const useAuthValidation = () => {
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  const checkPasswordStrength = (password) => {
    const strength = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
      score: 0
    };
    strength.score = Object.values(strength).filter(
      (value, index) => index < 5 && value === true
    ).length;
    return strength;
  };
  const validateLogin = (form) => {
    const errors = {};
    if (!form.email) {
      errors.email = "L'email est requis";
    } else if (!validateEmail(form.email)) {
      errors.email = "Format d'email invalide";
    }
    if (!form.password) {
      errors.password = "Le mot de passe est requis";
    } else if (form.password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caract\xE8res";
    }
    return errors;
  };
  const validateSignup = (form) => {
    const errors = {};
    if (!form.firstName) {
      errors.firstName = "Le pr\xE9nom est requis";
    } else if (form.firstName.length < 2) {
      errors.firstName = "Le pr\xE9nom doit contenir au moins 2 caract\xE8res";
    }
    if (!form.lastName) {
      errors.lastName = "Le nom est requis";
    } else if (form.lastName.length < 2) {
      errors.lastName = "Le nom doit contenir au moins 2 caract\xE8res";
    }
    if (!form.email) {
      errors.email = "L'email est requis";
    } else if (!validateEmail(form.email)) {
      errors.email = "Format d'email invalide";
    }
    if (!form.password) {
      errors.password = "Le mot de passe est requis";
    } else if (!validatePassword(form.password)) {
      errors.password = "Le mot de passe doit contenir au moins 8 caract\xE8res, une majuscule, une minuscule et un chiffre";
    }
    if (!form.confirmPassword) {
      errors.confirmPassword = "La confirmation du mot de passe est requise";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    if (!form.acceptTerms) {
      errors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
    }
    return errors;
  };
  return {
    validateEmail,
    validatePassword,
    checkPasswordStrength,
    validateLogin,
    validateSignup
  };
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Login",
  __ssrInlineRender: true,
  emits: ["switch-to-signup", "forgot-password", "login-success"],
  setup(__props, { emit: __emit }) {
    const { validateLogin } = useAuthValidation();
    const form = reactive({
      email: "",
      password: "",
      rememberMe: false
    });
    const showPassword = ref(false);
    const isLoading = ref(false);
    const errors = ref({});
    const isFormValid = computed(() => {
      return form.email && form.password && Object.keys(errors.value).length === 0;
    });
    watch(form, () => {
      errors.value = validateLogin(form);
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UFormGroup = __nuxt_component_0;
      const _component_UInput = __nuxt_component_1;
      const _component_UButton = __nuxt_component_2;
      const _component_UCheckbox = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-md mx-auto p-6 bg-card rounded-xl border border-border" }, _attrs))}><h2 class="text-2xl font-bold text-center mb-6">Connexion</h2><form class="space-y-4"><div>`);
      _push(ssrRenderComponent(_component_UFormGroup, {
        label: "Email",
        error: errors.value.email,
        required: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: form.email,
              "onUpdate:modelValue": ($event) => form.email = $event,
              type: "email",
              placeholder: "votre@email.com",
              color: errors.value.email ? "red" : "primary"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: form.email,
                "onUpdate:modelValue": ($event) => form.email = $event,
                type: "email",
                placeholder: "votre@email.com",
                color: errors.value.email ? "red" : "primary"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "color"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div>`);
      _push(ssrRenderComponent(_component_UFormGroup, {
        label: "Mot de passe",
        error: errors.value.password,
        required: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: form.password,
              "onUpdate:modelValue": ($event) => form.password = $event,
              type: showPassword.value ? "text" : "password",
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
              color: errors.value.password ? "red" : "primary"
            }, {
              trailing: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UButton, {
                    variant: "ghost",
                    size: "2xs",
                    onClick: ($event) => showPassword.value = !showPassword.value,
                    icon: showPassword.value ? "i-heroicons-eye-slash" : "i-heroicons-eye",
                    color: "gray"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UButton, {
                      variant: "ghost",
                      size: "2xs",
                      onClick: ($event) => showPassword.value = !showPassword.value,
                      icon: showPassword.value ? "i-heroicons-eye-slash" : "i-heroicons-eye",
                      color: "gray"
                    }, null, 8, ["onClick", "icon"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: form.password,
                "onUpdate:modelValue": ($event) => form.password = $event,
                type: showPassword.value ? "text" : "password",
                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                color: errors.value.password ? "red" : "primary"
              }, {
                trailing: withCtx(() => [
                  createVNode(_component_UButton, {
                    variant: "ghost",
                    size: "2xs",
                    onClick: ($event) => showPassword.value = !showPassword.value,
                    icon: showPassword.value ? "i-heroicons-eye-slash" : "i-heroicons-eye",
                    color: "gray"
                  }, null, 8, ["onClick", "icon"])
                ]),
                _: 1
              }, 8, ["modelValue", "onUpdate:modelValue", "type", "color"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: form.rememberMe,
        "onUpdate:modelValue": ($event) => form.rememberMe = $event,
        label: "Se souvenir de moi"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "link",
        size: "xs",
        color: "primary",
        onClick: ($event) => _ctx.$emit("forgot-password")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Mot de passe oubli\xE9 ? `);
          } else {
            return [
              createTextVNode(" Mot de passe oubli\xE9 ? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        block: "",
        loading: isLoading.value,
        disabled: !isFormValid.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Se connecter `);
          } else {
            return [
              createTextVNode(" Se connecter ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="text-center"><span class="text-sm text-muted-foreground"> Pas encore de compte ? </span>`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "link",
        size: "xs",
        color: "primary",
        onClick: ($event) => _ctx.$emit("switch-to-signup")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` S&#39;inscrire `);
          } else {
            return [
              createTextVNode(" S'inscrire ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("features/auth/components/Login.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Login",
  __ssrInlineRender: true,
  setup(__props) {
    const onLoginSuccess = async (payload) => {
      await navigateTo("/");
    };
    const onSwitchToSignup = () => {
      navigateTo("/auth/signup");
    };
    const onForgotPassword = () => {
      navigateTo("/auth/forgot");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col items-center justify-center py-12" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        onLoginSuccess,
        onSwitchToSignup,
        onForgotPassword
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=Login-DU3jVphP.mjs.map
