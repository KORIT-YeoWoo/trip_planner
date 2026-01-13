package com.korit.trip_planner_back.algorithm;

public class HaversineDistance {
    // 지구 반지름(km)
    private static final double EARTH_RADIUS = 6371.0;
    // 각도를 라디안으로 변환(degree -> radian)
    private static double toRadians(double degree){
        return degree * Math.PI / 180.0;
    }

    public static double calculate(double lat1, double lon1, double lat2, double lon2) {
        // 위도/경도 차이를 라디안으로 변환
        double dLat = toRadians(lat2 - lat1);
        double dLon = toRadians(lon2 - lon1);

        // 위도를 라디안으로 변환
        double radLat1 = toRadians(lat1);
        double radLat2 = toRadians(lat2);

        // 하버사인 공식 적용
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(radLat1) * Math.cos(radLat2) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // 거리 계산 (km)
        return EARTH_RADIUS * c;
    }

    public static double calculateTotalDistance(double[] latitudes, double[] longitudes) {
        if (latitudes.length != longitudes.length) {
            throw new IllegalArgumentException("위도와 경도 배열의 길이가 같아야 합니다.");
        }

        if (latitudes.length < 2) {
            throw new IllegalArgumentException("최소 2개 이상의 지점이 필요합니다.");
        }

        double totalDistance = 0.0;

        for (int i = 0; i < latitudes.length - 1; i++) {
            totalDistance += calculate(
                    latitudes[i], longitudes[i],
                    latitudes[i + 1], longitudes[i + 1]
            );
        }

        return totalDistance;
    }
}
