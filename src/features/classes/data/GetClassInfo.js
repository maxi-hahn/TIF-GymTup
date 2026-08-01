import { ClassInfoEs } from './ClassInfoEs'
import { ClassInfoEn } from './ClassInfoEn'

export const getClassInfo = (language) => {
  return language === 'es'
    ? ClassInfoEs
    : ClassInfoEn
}