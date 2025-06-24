"use client";
import { ProfilInterface } from "@/types/ProfilTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CalendarIcon, Lock, SaveAll, Timer, User2 } from "lucide-react";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  ProfilFormValidation,
  ProfilSkemaValidation,
} from "@/validation/ProfilValidation";
import { JenisKelamin } from "@/generated/prisma";

const Profil = () => {
  const [openDialogPassword, setOpenDialogPassword] =
    React.useState<boolean>(false);
  const [formPassword, setFormPassword] = React.useState<{
    password_lama: string;
    password_baru: string;
  }>({
    password_lama: "",
    password_baru: "",
  });
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
      JenisKelamin: JenisKelamin.PRIA,
      Nik: "",
      Nim: "",
      Alamat: "",
      AsalSekolah: "",
    },
  });
  const onSubmit = async (data: ProfilFormValidation) => {
    setLoading(true);
    // await updateProfilService(data);
    toast("Profil berhasil diubah");
    setLoading(false);
  };

  const submitUpdatePassword = async () => {
    setLoading(true);
    // const res = await updatePassword(formPassword);
    setOpenDialogPassword(false);
    setFormPassword({
      password_baru: "",
      password_lama: "",
    });
    // toast(res.message);
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="w-full items-center justify-between">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Data Profil</CardTitle>
                <CardDescription>
                  Silakan Ubah Data Profil anda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      <FormField
                        control={form.control}
                        name="Nama"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama</FormLabel>
                            <FormControl>
                              <Input readOnly={loading} {...field} />
                            </FormControl>
                            <FormDescription>Nama Anda</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input readOnly={loading} {...field} />
                            </FormControl>
                            <FormDescription>Email aktif anda.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="JenisKelamin"
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
                                    <SelectItem value="WANITA">
                                      WANITA
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormDescription>
                              Pilih Jenis Kelamin Anda.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Alamat"
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
                        name="Nik"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nik</FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={loading}
                                {...field}
                                placeholder="Nik Anda."
                              />
                            </FormControl>
                            <FormDescription>Masukan Nik</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="Nim"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nim</FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={loading}
                                {...field}
                                placeholder="Nim Anda."
                              />
                            </FormControl>
                            <FormDescription>Masukan Nim</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="AsalSekolah"
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
                            <FormDescription>
                              Masukan Asal Sekolah
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={loading}
                  className="mr-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                >
                  {loading ? <Timer /> : <SaveAll />}
                  {loading ? "Loading" : "Simpan Data"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setOpenDialogPassword(true)}
                  disabled={loading}
                  className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                >
                  {loading ? <Timer /> : <Lock />}
                  Ubah Password
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
      <Dialog open={openDialogPassword} onOpenChange={setOpenDialogPassword}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
            <DialogDescription>
              Anda Perlu memasukan Password Lama
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password_lama" className="text-right">
                Password Lama
              </Label>
              <Input
                value={formPassword.password_lama}
                onChange={(e) =>
                  setFormPassword({
                    ...formPassword,
                    password_lama: e.target.value,
                  })
                }
                id="password_lama"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password_baru" className="text-right">
                Password Baru
              </Label>
              <Input
                value={formPassword.password_baru}
                onChange={(e) =>
                  setFormPassword({
                    ...formPassword,
                    password_baru: e.target.value,
                  })
                }
                id="password_baru"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
              variant={"destructive"}
              type="button"
              onClick={() => setOpenDialogPassword(false)}
            >
              Tutup
            </Button>
            <Button
              className="mx-2  hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
              type="button"
              onClick={() => submitUpdatePassword()}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profil;
