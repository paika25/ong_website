<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  Twitter,
} from "lucide-vue-next";

type FormData = {
  name: string;
  email: string;
  message: string;
};

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const contactInfo = [
  { icon: Mail, text: "contact@johndoe.dev" },
  { icon: Phone, text: "+33 6 12 34 56 78" },
  { icon: MapPin, text: "Paris, France" },
];

// IntersectionObserver to trigger animations when in view
const rootRef = ref<HTMLElement | null>(null);
const isInView = ref(false);
let observer: IntersectionObserver | undefined;

onMounted(() => {
  if (!rootRef.value) return;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isInView.value = true;
          if (observer) {
            observer.disconnect(); // once: true
          }
        }
      });
    },
    { root: null, rootMargin: "-100px", threshold: 0.01 }
  );
  observer.observe(rootRef.value);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});

// Simple toast fallback (try to use global if available)
function toast(payload: { title: string; description?: string }) {
  // If a global $toast / useToast is available, use it. Fallback to alert + console.
  const anyWin = window as any;
  if (anyWin.$toast && typeof anyWin.$toast === "function") {
    anyWin.$toast(payload);
    return;
  }
  console.info("Toast:", payload);
  try {
    // show a non-blocking toast-like alert (quick fallback)
    // eslint-disable-next-line no-alert
    alert(`${payload.title}\n${payload.description ?? ""}`);
  } catch {
    /* ignore */
  }
}

// Form state & simple validation
const form = reactive<FormData>({
  name: "",
  email: "",
  message: "",
});
const errors = reactive<{ name?: string; email?: string; message?: string }>({});
const isSubmitting = ref(false);

function validate() {
  // reset
  errors.name = errors.email = errors.message = undefined;
  let ok = true;

  if (!form.name.trim()) {
    errors.name = "Le nom est requis";
    ok = false;
  }

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!form.email.trim()) {
    errors.email = "L'email est requis";
    ok = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = "Email invalide";
    ok = false;
  }

  if (!form.message.trim()) {
    errors.message = "Le message est requis";
    ok = false;
  } else if (form.message.trim().length < 10) {
    errors.message = "Le message doit contenir au moins 10 caractères";
    ok = false;
  }

  return ok;
}

async function onSubmit(e?: Event) {
  if (e) e.preventDefault();
  if (!validate()) return;
  isSubmitting.value = true;

  // Simulate API call
  await new Promise((r) => setTimeout(r, 2000));

  console.log("Form submitted:", { ...form });

  toast({
    title: "Message envoyé !",
    description: "Je vous répondrai dans les plus brefs délais.",
  });

  // reset
  form.name = "";
  form.email = "";
  form.message = "";
  isSubmitting.value = false;
}
</script>

<template>
  <section
    id="contact"
    ref="rootRef"
    class="py-20 md:py-32 relative overflow-hidden"
  >
    <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />

    <div class="container px-4 mx-auto">
      <h2 class="text-4xl font-bold mb-4 text-center">Contactez-moi</h2>
      <div class="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
      
    </div>
    <div class="container mx-auto px-6 relative z-10">
      <div
        :class="['text-center mb-16 transition-all duration-700', isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
      >
      </div>

      <div class="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Contact Info -->
        <div
          :class="['space-y-8 transition-all duration-700 delay-150', isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8']"
        >
          <div class="glass p-8 rounded-2xl">
            <h3 class="text-2xl font-bold mb-6">Informations de contact</h3>

            <div class="space-y-4">
              <div
                v-for="(item, index) in contactInfo"
                :key="item.text"
                :class="['flex items-center gap-4 p-4 rounded-xl glass-hover transition-all', isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4']"
                :style="{ transitionDelay: `${300 + index * 100}ms` }"
              >
                <div class="p-3 rounded-full bg-primary/20">
                  <component :is="item.icon" class="w-5 h-5 text-primary" />
                </div>
                <span class="text-muted-foreground">{{ item.text }}</span>
              </div>
            </div>
          </div>

          <div class="glass p-8 rounded-2xl">
            <h3 class="text-xl font-bold mb-6">Suivez-moi</h3>

            <div class="flex gap-4">
              <a
                v-for="(social, index) in socialLinks"
                :key="social.label"
                :href="social.href"
                class="p-4 glass glass-hover rounded-xl hover:scale-110 transition-transform group"
                :aria-label="social.label"
                :style="{ transitionDelay: `${600 + index * 100}ms` }"
              >
                <component :is="social.icon" class="w-6 h-6 group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          <div class="glass p-8 rounded-2xl transition-all duration-700 delay-300" :class="isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
            <h3 class="text-xl font-bold mb-3">Disponibilité</h3>
            <p class="text-muted-foreground">
              Actuellement disponible pour des projets freelance et des opportunités à temps plein.
            </p>
            <div class="mt-4 flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span class="text-sm text-green-500 font-medium">Disponible</span>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div :class="['transition-all duration-700 delay-150', isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8']">
          <form @submit="onSubmit" class="glass p-8 rounded-2xl space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium mb-2">Nom complet</label>
              <input
                id="name"
                type="text"
                v-model="form.name"
                class="w-full px-4 py-3 rounded-xl glass border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="John Doe"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-destructive">{{ errors.name }}</p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium mb-2">Email</label>
              <input
                id="email"
                type="email"
                v-model="form.email"
                class="w-full px-4 py-3 rounded-xl glass border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="john@example.com"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-destructive">{{ errors.email }}</p>
            </div>

            <div>
              <label for="message" class="block text-sm font-medium mb-2">Message</label>
              <textarea
                id="message"
                rows="6"
                v-model="form.message"
                class="w-full px-4 py-3 rounded-xl glass border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                placeholder="Décrivez votre projet..."
              />
              <p v-if="errors.message" class="mt-1 text-sm text-destructive">{{ errors.message }}</p>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full px-8 py-4 rounded-xl glass neon-glow font-semibold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              <template v-if="isSubmitting">
                <div class="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                Envoi en cours...
              </template>
              <template v-else>
                Envoyer le message
                <Send class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </template>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Minimal helpers to mimic animate from the React version.
   Project Tailwind classes handle most styling; keep tiny fallbacks here. */

.gradient-text {
  background: linear-gradient(90deg, var(--tw-gradient-stops));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* glass / glass-hover / neon-glow classes are expected from user's Tailwind config.
   Provide tiny fallbacks if missing. */

.glass {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.glass-hover:hover {
  background: rgba(255, 255, 255, 0.06);
}

.neon-glow {
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.08);
}

/* spinner fallback border color variables; adjust according to your theme */
.border-foreground\/30 {
  border-color: rgba(255, 255, 255, 0.3);
}
.border-t-foreground {
  border-top-color: rgba(255, 255, 255, 0.9);
}
</style>