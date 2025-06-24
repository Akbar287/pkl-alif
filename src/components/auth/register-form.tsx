"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { LogInIcon } from "lucide-react";
import {
  ProfilFormValidation,
  ProfilSkemaValidation,
} from "@/validation/ProfilValidation";
import { setRegister } from "@/services/Auth/RegisterService";
import { JenisKelamin } from "@/generated/prisma";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const RegisterForm = () => {
  const { data: session } = useSession();
  const searchParam = useSearchParams();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const form = useForm<ProfilFormValidation>({
    resolver: zodResolver(ProfilSkemaValidation),
    defaultValues: {
      UserId: "",
      RoleId: "",
      MhsId: "",
      Nama: "",
      Email: "",
      Password: "",
      Nik: "",
      Nim: "",
      Alamat: "",
      AsalSekolah: "",
      JenisKelamin: undefined,
    },
  });

  const onSubmit = async (data: ProfilFormValidation) => {
    setLoading(true);
    await setRegister({
      MhsId: data.MhsId ?? "",
      RoleId: data.RoleId ?? "",
      UserId: data.UserId ?? "",
      JenisKelamin: data.JenisKelamin
        ? data.JenisKelamin.match("PRIA")
          ? JenisKelamin.PRIA
          : JenisKelamin.WANITA
        : JenisKelamin.PRIA,
      Nik: data.Nik,
      Nim: data.Nim,
      Alamat: data.Alamat,
      AsalSekolah: data.AsalSekolah,
      Nama: data.Nama,
      Email: data.Email,
      Password: data.Password,
    })
      .then((res) => {
        form.reset();
        toast("Register berhasil. silakan masuk melalui halaman login");
        setSuccessMessage(
          "Register berhasil. silakan masuk melalui halaman login"
        );
        setLoading(false);
      })
      .catch((err) => {
        setErrorMessage("Error: " + err);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    if (searchParam.get("msg")) {
      setErrorMessage(searchParam.get("msg") as string);
    }
    if (session) {
      window.location.href = searchParam.get("callbackUrl") || "/";
    }
  }, []);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6")}
      >
        {errorMessage && (
          <Alert
            variant="destructive"
            className="border bg-transparent border-red-500"
          >
            <LogInIcon className="" />
            <AlertTitle className="font-semibold">Kesalahan</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert
            variant="default"
            className="border bg-transparent border-primary"
          >
            <LogInIcon className="" />
            <AlertTitle className="font-semibold">Berhasil</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        <div className="w-full grid grid-cols-1 gap-3 px-4">
          <div className="">
            <div className="grid grid-cols-1 gap-3">
              <FormField
                control={form.control}
                name="Nama"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input readOnly={loading} {...field} />
                    </FormControl>
                    <FormDescription>Nama</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled={loading}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input readOnly={loading} {...field} />
                    </FormControl>
                    <FormDescription>Email</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Password"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input readOnly={loading} type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Masukan Password Baru untuk mengganti yang lama
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="JenisKelamin"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <FormControl>
                      <Select
                        disabled={loading}
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Jenis Kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Jenis Kelamin</SelectLabel>
                            <SelectItem value="PRIA">PRIA</SelectItem>
                            <SelectItem value="WANITA">WANITA</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Pilih Jenis Kelamin Anda.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Nik"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nik</FormLabel>
                    <FormControl>
                      <Input readOnly={loading} {...field} />
                    </FormControl>
                    <FormDescription>Nik</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Nim"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nim</FormLabel>
                    <FormControl>
                      <Input readOnly={loading} {...field} />
                    </FormControl>
                    <FormDescription>Nim</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Alamat"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        {...field}
                        placeholder="Alamat Anda."
                      />
                    </FormControl>
                    <FormDescription>
                      Masukan Alamat Lengkap Rumah Anda
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="AsalSekolah"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asal Sekolah</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        {...field}
                        placeholder="Asal Sekolah Anda."
                      />
                    </FormControl>
                    <FormDescription>Masukan Asal Sekolah Anda</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <Button
          type="submit"
          className="hover:scale-105 active:scale-95 transition-all duration-100 cursor-pointer"
        >
          Registrasi
        </Button>
      </form>
      <div className="text-balance my-5 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
        Sudah Memiliki Akun? <Link href={"/login"}> Login</Link>
      </div>
    </Form>
  );
};

export default RegisterForm;
