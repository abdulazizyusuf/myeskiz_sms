import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor () {}

  public getCountries(lang):any {
  	return this.http.get(env.apiUrl+'/api/countries-list?lang='+lang);
  }

  public getCountry(country_name):any {
    return this.http.get(env.apiUrl+'/api/country-name?country='+country_name);
  }

  public getRegion(countryID):any {
    return this.http.get(env.apiUrl+'/api/region?country_id='+countryID);
  }

  public getCity(regionID) {
  	return this.http.get(env.apiUrl+'/api/city?region_id='+regionID);
  }

  public getCityByCountry(countryID) {
    return this.http.get(env.apiUrl+'/api/city?country_id='+countryID);
  }

  public getAllCountry():any {
    return this.http.get(env.apiUrl+'/api/country');
  }

  public updateCountry(data):any {
    return this.http.put(env.apiUrl+'/api/country/'+data.id, data);
  }

  public createCountry(data) {
    return this.http.post(env.apiUrl+'/api/country', data);
  }

  public deleteCountry(data) {
    return this.http.delete(env.apiUrl+'/api/country/'+data.id);
  }

}  


@Injectable({
  providedIn: 'root'
})
export class CityService {
  private http = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor () {}

  public getCities():any {
    return this.http.get(env.apiUrl+'/api/cities');
  }

  public updateCity(city):any {
    return this.http.put(env.apiUrl+'/api/cities/'+city.id, city);
  }

  public createCity(city) {
    return this.http.post(env.apiUrl+'/api/cities', city);
  }

  public deleteCity(city) {
    return this.http.delete(env.apiUrl+'/api/cities/'+city.id);
  }

}  