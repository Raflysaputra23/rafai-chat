"use server";

import { formSchemaCluster, formSchemaLogin, formSchemaRegister } from "./formSchema";

export const formLoginValidation = async (
  prev: unknown,
  formData: FormData,
) => {
  const data = Object.fromEntries(formData.entries());
  const validasiData = formSchemaLogin.safeParse(data);
  if (!validasiData.success) {
    return {
      error: validasiData.error.flatten().fieldErrors,
      success: false,
      message: "Data tidak valid",
    };
  }

  try {
    return {
      error: null,
      success: true,
      message: "Data valid",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: "Data tidak valid",
    };
  }
};

export const formRegisterValidation = async (
  prev: unknown,
  formData: FormData,
) => {
  const data = Object.fromEntries(formData.entries());
  const validasiData = formSchemaRegister.safeParse(data);
  if (!validasiData.success) {
    return {
      error: validasiData.error.flatten().fieldErrors,
      success: false,
      message: "Data tidak valid",
    };
  }

  try {
    return {
      error: null,
      success: true,
      message: "Data valid",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: "Data tidak valid",
    };
  }
};

export const formClusterValidation = async (
  prev: unknown,
  formData: FormData,
) => {
  const data = Object.fromEntries(formData.entries());
  const validasiData = formSchemaCluster.safeParse(data);
  if (!validasiData.success) {
    return {
      error: validasiData.error.flatten().fieldErrors,
      success: false,
      message: "Data tidak valid",
    };
  }

  try {
    return {
      error: null,
      success: true,
      message: "Data valid",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: "Data tidak valid",
    };
  }
};
