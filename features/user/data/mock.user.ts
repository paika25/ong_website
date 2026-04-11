import type { User } from '../types/user.types'

export const mockUsers: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'marius@example.com',
    accountType: 'user_agent',
    firstName: 'Marius',
    lastName: 'Razafitsalama',
    fullName: 'Marius Razafitsalama',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    bio: 'Développeur passionné par les technologies web et l\'aide aux communautés locales. Spécialisé en Laravel, Vue.js et architecture logicielle.',
    location: 'Antananarivo, Madagascar',
    website: 'https://marius-portfolio.com',
    verified: true,
    createdAt: '2022-01-15T00:00:00Z',
    updatedAt: new Date().toISOString(),
    stats: {
      ongs: 3,
      projects: 12,
      donations: 0,
      totalDonated: 0
    }
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'marie.dubois@example.com',
    accountType: 'user_agent',
    firstName: 'Marie',
    lastName: 'Dubois',
    fullName: 'Marie Dubois',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200',
    bio: 'Coordinatrice de projets humanitaires avec 8 ans d\'expérience dans le développement communautaire.',
    location: 'Fianarantsoa, Madagascar',
    verified: true,
    createdAt: '2021-03-20T00:00:00Z',
    updatedAt: new Date().toISOString(),
    stats: {
      ongs: 2,
      projects: 8,
      donations: 0,
      totalDonated: 0
    }
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    email: 'contact@techforgood.mg',
    accountType: 'user_partner',
    firstName: 'Tech',
    lastName: 'ForGood',
    fullName: 'Tech ForGood',
    companyName: 'TechForGood Madagascar',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
    bio: 'Entreprise technologique engagée dans la transformation digitale pour le bien social.',
    location: 'Antananarivo, Madagascar',
    website: 'https://techforgood.mg',
    verified: true,
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    stats: {
      ongs: 3,
      projects: 0,
      donations: 12,
      totalDonated: 12000
    }
  }
]