export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface PasswordStrength {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
  score: number
}

export const useAuthValidation = () => {
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
  }

  const checkPasswordStrength = (password: string): PasswordStrength => {
    const strength: PasswordStrength = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
      score: 0
    }

    // Calcul du score de force
    strength.score = Object.values(strength).filter((value, index) => 
      index < 5 && value === true
    ).length

    return strength
  }

  const validateLogin = (form: LoginForm): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (!form.email) {
      errors.email = 'L\'email est requis'
    } else if (!validateEmail(form.email)) {
      errors.email = 'Format d\'email invalide'
    }

    if (!form.password) {
      errors.password = 'Le mot de passe est requis'
    } else if (form.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    return errors
  }

  const validateSignup = (form: SignupForm): Record<string, string> => {
    const errors: Record<string, string> = {}

    // Validation prénom
    if (!form.firstName) {
      errors.firstName = 'Le prénom est requis'
    } else if (form.firstName.length < 2) {
      errors.firstName = 'Le prénom doit contenir au moins 2 caractères'
    }

    // Validation nom
    if (!form.lastName) {
      errors.lastName = 'Le nom est requis'
    } else if (form.lastName.length < 2) {
      errors.lastName = 'Le nom doit contenir au moins 2 caractères'
    }

    // Validation email
    if (!form.email) {
      errors.email = 'L\'email est requis'
    } else if (!validateEmail(form.email)) {
      errors.email = 'Format d\'email invalide'
    }

    // Validation mot de passe
    if (!form.password) {
      errors.password = 'Le mot de passe est requis'
    } else if (!validatePassword(form.password)) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre'
    }

    // Validation confirmation mot de passe
    if (!form.confirmPassword) {
      errors.confirmPassword = 'La confirmation du mot de passe est requise'
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    // Validation conditions d'utilisation
    if (!form.acceptTerms) {
      errors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation'
    }

    return errors
  }

  return {
    validateEmail,
    validatePassword,
    checkPasswordStrength,
    validateLogin,
    validateSignup
  }
}