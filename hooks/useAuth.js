"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuthStore from "../store/authStore.js";
import {
  registerApi,
  loginApi,
  logoutApi,
  getMeApi,
  forgotPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  updateProfileApi,
  getWishlistApi,
  toggleWishlistApi,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
  getOrderHistoryApi,
} from "../services/auth.service.js";

export const useRegister = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      setUser(data.data.customer);
      toast.success("Welcome to ShopBD!");
      router.push("/dashboard");
    },
    onError: (err) => toast.error(err.message || "Registration failed"),
  });
};

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setUser(data.data.customer);
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError: (err) => toast.error(err.message || "Login failed"),
  });
};

export const useLogout = () => {
  const clearUser = useAuthStore((s) => s.clearUser);
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearUser();
      qc.clear();
      toast.success("Logged out.");
      router.push("/login");
    },
  });
};

export const useMe = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (email) => forgotPasswordApi(email),
    onSuccess: () => toast.success("Reset link sent to your email!"),
    onError: (err) => toast.error(err.message || "Failed to send reset link"),
  });

export const useResetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ token, password }) => resetPasswordApi(token, password),
    onSuccess: () => {
      toast.success("Password reset!");
      router.push("/login");
    },
    onError: (err) => toast.error(err.message || "Reset failed"),
  });
};

export const useUpdateProfile = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (data) => {
      setUser(data.data);
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated!");
    },
    onError: (err) => toast.error(err.message || "Update failed"),
  });
};

export const useWishlist = () =>
  useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistApi,
    enabled: useAuthStore.getState().isAuthenticated,
  });

// mutate(productId) → যোগ; mutate({ productId, isInWishlist: true }) → মোছা
export const useToggleWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (arg) =>
      typeof arg === "object" && arg !== null
        ? toggleWishlistApi(arg.productId, !!arg.isInWishlist)
        : toggleWishlistApi(arg, false),
    onSuccess: (data, arg) => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      qc.invalidateQueries({ queryKey: ["me"] });
      const removed = typeof arg === "object" && arg !== null && arg.isInWishlist;
      toast.success(`${removed ? "Removed from" : "Added to"} wishlist`);
    },
    onError: (err) => toast.error(err.message || "Wishlist update failed"),
  });
};

export const useOrderHistory = (params) =>
  useQuery({
    queryKey: ["order-history", params],
    queryFn: () => getOrderHistoryApi(params),
    enabled: useAuthStore.getState().isAuthenticated,
  });

export const useAddAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addAddressApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Address added!");
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAddressApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Address removed.");
    },
  });
};
