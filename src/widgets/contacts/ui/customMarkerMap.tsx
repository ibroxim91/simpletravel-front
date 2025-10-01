'use client';

import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

export default function CustomMarkerMap() {
  return (
    <div className="h-[500px] w-full">
      <YMaps query={{ lang: 'ru_RU' }}>
        <Map
          defaultState={{ center: [55.751574, 37.573856], zoom: 5 }}
          width="100%"
          height="100%"
          className="rounded-3xl"
        >
          <Placemark
            geometry={[55.751574]}
            options={{
              preset: 'islands#circleDotIcon',
              iconColor: '#FF0000',
            }}
            properties={{
              balloonContentHeader: 'New York',
              balloonContentBody: "Batafsil ma'lumot bu yerda",
              hintContent: 'New York shahri',
            }}
          />
        </Map>
      </YMaps>
    </div>
  );
}
