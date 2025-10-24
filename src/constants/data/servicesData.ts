import { Service } from '@/types';
import servicesData from '../../../data/services.json';

export const services: Service[] = servicesData as Service[];

export const getServiceByTitle = (title: string): Service | undefined => {
  return services.find(service => service.title === title);
};

export const getAllServices = (): Service[] => {
  return services;
};
