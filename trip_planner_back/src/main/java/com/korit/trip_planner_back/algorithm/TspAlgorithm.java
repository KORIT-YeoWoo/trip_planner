package com.korit.trip_planner_back.algorithm;

import com.korit.trip_planner_back.entity.TouristSpot;

import java.util.ArrayList;
import java.util.List;

public class TspAlgorithm {

    public static TspResult optimize(List<TouristSpot> spots,
                                     double startLat, double startLon,
                                     double endLat, double endLon) {
        return optimize(spots, startLat, startLon, endLat, endLon, 100);
    }

    public static TspResult optimize(List<TouristSpot> spots,
                                     double startLat, double startLon,
                                     double endLat, double endLon,
                                     int maxIterations) {
        if (spots == null || spots.isEmpty()) {
            throw new IllegalArgumentException("관광지 리스트가 비어있습니다.");
        }

        long startTime = System.currentTimeMillis();

        // 1단계: Greedy로 초기 경로 생성
        List<TouristSpot> greedyRoute = greedy(spots, startLat, startLon);
        double greedyDistance = calculateDistance(greedyRoute, startLat, startLon, endLat, endLon);

        // 2단계: 2-Opt로 최적화
        List<TouristSpot> optimizedRoute = twoOpt(greedyRoute, startLat, startLon, endLat, endLon, maxIterations);
        double optimizedDistance = calculateDistance(optimizedRoute, startLat, startLon, endLat, endLon);

        long endTime = System.currentTimeMillis();

        return new TspResult(
                optimizedRoute,
                greedyDistance,
                optimizedDistance,
                endTime - startTime
        );
    }

    private static List<TouristSpot> greedy(List<TouristSpot> spots,
                                            double startLat,
                                            double startLon) {
        List<TouristSpot> route = new ArrayList<>();
        List<TouristSpot> unvisited = new ArrayList<>(spots);

        double currentLat = startLat;
        double currentLon = startLon;

        while (!unvisited.isEmpty()) {
            TouristSpot nearest = null;
            double minDistance = Double.MAX_VALUE;

            // 가장 가까운 관광지 찾기
            for (TouristSpot spot : unvisited) {
                double distance = HaversineDistance.calculate(
                        currentLat, currentLon,
                        spot.getLatitude(), spot.getLongitude()
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = spot;
                }
            }

            route.add(nearest);
            unvisited.remove(nearest);

            currentLat = nearest.getLatitude();
            currentLon = nearest.getLongitude();
        }
        return route;
    }

    private static List<TouristSpot> twoOpt(List<TouristSpot> route,
                                            double startLat, double startLon,
                                            double endLat, double endLon,
                                            int maxIterations) {
        if (route.size() <= 2) {
            return new ArrayList<>(route);
        }

        List<TouristSpot> bestRoute = new ArrayList<>(route);
        double bestDistance = calculateDistance(bestRoute, startLat, startLon, endLat, endLon);

        boolean improved = true;
        int iterations = 0;

        while (improved && iterations < maxIterations) {
            improved = false;
            iterations++;

            // i+1 ~ j 구간을 뒤집어보기
            for (int i = 0; i < bestRoute.size() - 1; i++) {
                for (int j = i + 2; j < bestRoute.size(); j++) {
                    List<TouristSpot> newRoute = reverse(bestRoute, i, j);
                    double newDistance = calculateDistance(newRoute, startLat, startLon, endLat, endLon);

                    if (newDistance < bestDistance) {
                        bestRoute = newRoute;
                        bestDistance = newDistance;
                        improved = true;
                    }
                }
            }
        }

        return bestRoute;
    }
    private static List<TouristSpot> reverse(List<TouristSpot> route, int i, int j) {
        List<TouristSpot> newRoute = new ArrayList<>();

        // 0 ~ i: 유지
        for (int k = 0; k <= i; k++) {
            newRoute.add(route.get(k));
        }

        // i+1 ~ j: 뒤집기
        for (int k = j; k >= i + 1; k--) {
            newRoute.add(route.get(k));
        }

        // j+1 ~ 끝: 유지
        for (int k = j + 1; k < route.size(); k++) {
            newRoute.add(route.get(k));
        }

        return newRoute;
    }

    public static double calculateDistance(List<TouristSpot> route,
                                           double startLat, double startLon,
                                           double endLat, double endLon) {
        if (route == null || route.isEmpty()) {
            return HaversineDistance.calculate(startLat, startLon, endLat, endLon);
        }

        double totalDistance = 0.0;

        // 출발 → 첫 관광지
        totalDistance += HaversineDistance.calculate(
                startLat, startLon,
                route.get(0).getLatitude(), route.get(0).getLongitude()
        );

        // 관광지들 간 이동
        for (int i = 0; i < route.size() - 1; i++) {
            TouristSpot from = route.get(i);
            TouristSpot to = route.get(i + 1);

            totalDistance += HaversineDistance.calculate(
                    from.getLatitude(), from.getLongitude(),
                    to.getLatitude(), to.getLongitude()
            );
        }

        // 마지막 관광지 → 도착
        TouristSpot lastSpot = route.get(route.size() - 1);
        totalDistance += HaversineDistance.calculate(
                lastSpot.getLatitude(), lastSpot.getLongitude(),
                endLat, endLon
        );

        return totalDistance;
    }

    public static class TspResult {
        private final List<TouristSpot> route;
        private final double greedyDistance;
        private final double optimizedDistance;
        private final long calculationTime;

        public TspResult(List<TouristSpot> route,
                         double greedyDistance,
                         double optimizedDistance,
                         long calculationTime) {
            this.route = route;
            this.greedyDistance = greedyDistance;
            this.optimizedDistance = optimizedDistance;
            this.calculationTime = calculationTime;
        }

        public List<TouristSpot> getRoute() {
            return route;
        }

        public double getGreedyDistance() {
            return greedyDistance;
        }

        public double getOptimizedDistance() {
            return optimizedDistance;
        }

        public long getCalculationTime() {
            return calculationTime;
        }

        public double getImprovementRate() {
            if (greedyDistance == 0) return 0;
            return ((greedyDistance - optimizedDistance) / greedyDistance) * 100;
        }

        public double getDistanceReduced() {
            return greedyDistance - optimizedDistance;
        }

        @Override
        public String toString() {
            return String.format(
                    "Greedy: %.1fkm → 2-Opt: %.1fkm (%.1f%% 개선, %dms)",
                    greedyDistance,
                    optimizedDistance,
                    getImprovementRate(),
                    calculationTime
            );
        }
    }
}