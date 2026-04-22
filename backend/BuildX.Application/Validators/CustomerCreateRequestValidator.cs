using FluentValidation;
using BuildX.Application.Dtos;

namespace BuildX.Application.Validators;

public class CustomerCreateRequestValidator : CustomerRequestValidatorBase<CustomerCreateRequest>
{
    public CustomerCreateRequestValidator()
    {
        RuleFor(x => x.Document)
            .NotEmpty().WithMessage("Document (CPF) is required.")
            .Must(BeAValidCpf).WithMessage("Invalid CPF format or check digits.");
    }

    private bool BeAValidCpf(string cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf)) return false;
        
        var digits = cpf.Where(char.IsDigit).ToArray();
        if (digits.Length != 11) return false;
        if (digits.All(d => d == digits[0])) return false;

        int sum = 0;
        for (int i = 0; i < 9; i++) sum += (digits[i] - '0') * (10 - i);
        int rev = 11 - (sum % 11);
        if (rev == 10 || rev == 11) rev = 0;
        if (rev != (digits[9] - '0')) return false;

        sum = 0;
        for (int i = 0; i < 10; i++) sum += (digits[i] - '0') * (11 - i);
        rev = 11 - (sum % 11);
        if (rev == 10 || rev == 11) rev = 0;
        if (rev != (digits[10] - '0')) return false;

        return true;
    }
}
